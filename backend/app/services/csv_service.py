import os
import re
from datetime import datetime
import pandas as pd
from dateutil import parser
from app.models import db, Transaction, UploadedStatement
from app.services.categorizer_service import categorize_transaction

DATE_COLUMNS = ['date', 'txn date', 'transaction date', 'value date', 'posting date', 'txn_date', 'trans date']
DESC_COLUMNS = ['description', 'narration', 'particulars', 'details', 'memo', 'remarks', 'transaction remarks', 'payee']
DEBIT_COLUMNS = ['debit', 'withdrawal', 'dr', 'paid out', 'expense', 'debit amount', 'withdrawal amount', 'dr amount']
CREDIT_COLUMNS = ['credit', 'deposit', 'cr', 'paid in', 'income', 'credit amount', 'deposit amount', 'cr amount']
BALANCE_COLUMNS = ['balance', 'closing balance', 'available balance', 'bal', 'net balance']
AMOUNT_COLUMNS = ['amount', 'txn amount', 'transaction amount', 'net amount']
TYPE_COLUMNS = ['type', 'txn type', 'transaction type', 'cr/dr', 'd/c']

def clean_column_name(col):
    return str(col).strip().lower().replace('_', ' ').replace('-', ' ')

def clean_amount(val):
    if pd.isna(val) or val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).strip().replace('₹', '').replace('Rs.', '').replace('INR', '').replace(',', '').replace(' ', '')
    try:
        return float(val_str)
    except (ValueError, TypeError):
        return 0.0

def parse_date(date_val):
    if pd.isna(date_val) or date_val is None:
        return None
    try:
        if isinstance(date_val, datetime):
            return date_val.date()
        if hasattr(date_val, 'date'):
            return date_val.date()
        date_str = str(date_val).strip()
        if not date_str or date_str.lower() == 'nan':
            return None
        # ISO format YYYY-MM-DD or YYYY/MM/DD (year first!)
        if re.match(r'^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}', date_str):
            return parser.parse(date_str, yearfirst=True, dayfirst=False).date()
        # Standard British/Indian bank statement format DD-MM-YYYY or DD/MM/YYYY
        if re.match(r'^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}', date_str):
            return parser.parse(date_str, dayfirst=True).date()
        # General parser fallback
        return parser.parse(date_str).date()
    except Exception:
        return None

def detect_columns(df):
    clean_cols = {col: clean_column_name(col) for col in df.columns}
    
    date_col = next((col for col, name in clean_cols.items() if any(dc in name for dc in DATE_COLUMNS)), None)
    desc_col = next((col for col, name in clean_cols.items() if any(dc in name for dc in DESC_COLUMNS)), None)
    debit_col = next((col for col, name in clean_cols.items() if any(dc == name or f" {dc} " in f" {name} " or name.startswith(dc) for dc in DEBIT_COLUMNS)), None)
    credit_col = next((col for col, name in clean_cols.items() if any(dc == name or f" {dc} " in f" {name} " or name.startswith(dc) for dc in CREDIT_COLUMNS)), None)
    balance_col = next((col for col, name in clean_cols.items() if any(bc in name for bc in BALANCE_COLUMNS)), None)
    amount_col = next((col for col, name in clean_cols.items() if any(ac == name for ac in AMOUNT_COLUMNS)), None)
    type_col = next((col for col, name in clean_cols.items() if any(tc == name for tc in TYPE_COLUMNS)), None)

    return {
        "date": date_col,
        "description": desc_col,
        "debit": debit_col,
        "credit": credit_col,
        "balance": balance_col,
        "amount": amount_col,
        "type": type_col
    }

def detect_bank(df, filename=""):
    fn_lower = filename.lower()
    if "hdfc" in fn_lower:
        return "HDFC Bank"
    if "sbi" in fn_lower:
        return "State Bank of India"
    if "icici" in fn_lower:
        return "ICICI Bank"
    if "axis" in fn_lower:
        return "Axis Bank"
    if "kotak" in fn_lower:
        return "Kotak Mahindra Bank"
    return "Standard Bank Statement"

def process_csv_file(filepath, user_id, original_filename="statement.csv"):
    try:
        # Read CSV with flexible delimiters and encodings
        try:
            df = pd.read_csv(filepath, encoding='utf-8')
        except UnicodeDecodeError:
            df = pd.read_csv(filepath, encoding='latin1')
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to read CSV file: {str(e)}"
        }

    if df.empty or len(df.columns) < 2:
        return {
            "success": False,
            "error": "CSV file is empty or invalid format."
        }

    # Clean whitespace in column names
    df.columns = [str(c).strip() for c in df.columns]
    mapping = detect_columns(df)

    if not mapping["date"] or not mapping["description"]:
        return {
            "success": False,
            "error": f"Could not detect required columns ('Date' and 'Description'). Found columns: {list(df.columns)}"
        }

    bank_name = detect_bank(df, original_filename)
    preview_rows = []
    valid_count = 0
    invalid_count = 0
    duplicate_count = 0
    latest_valid_balance = None

    # Fetch user's existing transactions for duplicate detection
    existing_records = {(t.date.isoformat(), re.sub(r'\s+', ' ', t.description.strip().lower()), round(t.amount, 2), t.type)
                        for t in Transaction.query.filter_by(user_id=user_id).all()}

    for idx, row in df.iterrows():
        try:
            date_val = parse_date(row[mapping["date"]])
            if not date_val:
                invalid_count += 1
                continue

            desc_val = str(row[mapping["description"]]).strip()
            if not desc_val or desc_val.lower() == 'nan':
                invalid_count += 1
                continue

            # Determine Amount and Type
            txn_type = "expense"
            amount = 0.0

            if mapping["debit"] and mapping["credit"]:
                debit_val = clean_amount(row[mapping["debit"]])
                credit_val = clean_amount(row[mapping["credit"]])

                if credit_val > 0:
                    txn_type = "income"
                    amount = credit_val
                elif debit_val > 0:
                    txn_type = "expense"
                    amount = debit_val
                else:
                    invalid_count += 1
                    continue
            elif mapping["amount"]:
                amt_val = clean_amount(row[mapping["amount"]])
                if mapping["type"]:
                    type_str = str(row[mapping["type"]]).strip().lower()
                    if 'cr' in type_str or 'income' in type_str or 'deposit' in type_str:
                        txn_type = "income"
                    else:
                        txn_type = "expense"
                else:
                    txn_type = "expense" if amt_val < 0 else "income"
                amount = abs(amt_val)
            else:
                invalid_count += 1
                continue

            if amount <= 0:
                invalid_count += 1
                continue

            # Extract balance if available
            balance_val = None
            if mapping["balance"] and not pd.isna(row[mapping["balance"]]):
                balance_val = clean_amount(row[mapping["balance"]])
                latest_valid_balance = balance_val

            category = categorize_transaction(desc_val, txn_type)
            
            # Check duplicate
            normalized_desc = re.sub(r'\s+', ' ', desc_val.lower())
            is_dup = (date_val.isoformat(), normalized_desc, round(amount, 2), txn_type) in existing_records
            if is_dup:
                duplicate_count += 1

            preview_rows.append({
                "row_index": idx,
                "date": date_val.isoformat(),
                "description": desc_val,
                "amount": round(amount, 2),
                "type": txn_type,
                "category": category,
                "payment_method": "Bank Transfer",
                "balance": round(balance_val, 2) if balance_val is not None else None,
                "is_duplicate": is_dup,
                "is_valid": True
            })
            valid_count += 1

        except Exception:
            invalid_count += 1

    return {
        "success": True,
        "bank_name": bank_name,
        "filename": original_filename,
        "total_rows": len(df),
        "valid_rows": valid_count,
        "invalid_rows": invalid_count,
        "duplicate_rows": duplicate_count,
        "closing_balance": round(latest_valid_balance, 2) if latest_valid_balance is not None else None,
        "preview_data": preview_rows[:100],  # preview first 100 rows
        "all_valid_data": preview_rows
    }

def import_transactions_from_data(user_id, transactions_data, filename="statement.csv", bank_name="Bank"):
    successful = 0
    duplicates = 0
    invalid = 0

    existing_records = {(t.date.isoformat(), re.sub(r'\s+', ' ', t.description.strip().lower()), round(t.amount, 2), t.type)
                        for t in Transaction.query.filter_by(user_id=user_id).all()}

    # Determine statement closing balance from latest valid transaction row
    closing_balance = None
    for item in reversed(transactions_data):
        if item.get("balance") is not None:
            try:
                closing_balance = float(item["balance"])
                break
            except (ValueError, TypeError):
                pass

    statement = UploadedStatement(
        user_id=user_id,
        filename=filename,
        original_filename=filename,
        bank_name=bank_name,
        total_rows=len(transactions_data),
        closing_balance=closing_balance
    )
    db.session.add(statement)
    db.session.flush()

    for item in transactions_data:
        try:
            date_val = datetime.strptime(item["date"], "%Y-%m-%d").date()
            desc_val = item["description"].strip()
            amount_val = float(item["amount"])
            type_val = item["type"]
            category_val = item.get("category") or categorize_transaction(desc_val, type_val)
            payment_val = item.get("payment_method") or "Bank Transfer"
            
            balance_val = None
            if item.get("balance") is not None:
                try:
                    balance_val = float(item["balance"])
                except (ValueError, TypeError):
                    pass

            normalized_desc = re.sub(r'\s+', ' ', desc_val.lower())
            record_key = (date_val.isoformat(), normalized_desc, round(amount_val, 2), type_val)
            if record_key in existing_records:
                duplicates += 1
                continue

            txn = Transaction(
                user_id=user_id,
                date=date_val,
                description=desc_val,
                amount=amount_val,
                type=type_val,
                category=category_val,
                payment_method=payment_val,
                balance=balance_val,
                source="csv",
                statement_id=statement.id,
                notes=f"Imported from {filename}"
            )
            db.session.add(txn)
            existing_records.add(record_key)
            successful += 1
        except Exception:
            invalid += 1

    statement.successful_rows = successful
    statement.duplicate_rows = duplicates
    statement.invalid_rows = invalid

    db.session.commit()

    return {
        "statement_id": statement.id,
        "total_rows": len(transactions_data),
        "successful_rows": successful,
        "duplicate_rows": duplicates,
        "invalid_rows": invalid
    }
