from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Transaction, Category
from app.utils.response import success_response, error_response
from app.services.categorizer_service import categorize_transaction

transaction_bp = Blueprint('transactions', __name__, url_prefix='/api/transactions')

@transaction_bp.route('', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = int(get_jwt_identity())
    
    # Query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '').strip()
    txn_type = request.args.get('type', '').strip()
    category = request.args.get('category', '').strip()
    payment_method = request.args.get('payment_method', '').strip()
    start_date = request.args.get('start_date', '').strip()
    end_date = request.args.get('end_date', '').strip()
    sort_by = request.args.get('sort_by', 'date_desc').strip()

    query = Transaction.query.filter_by(user_id=user_id)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Transaction.description.ilike(search_fmt)) |
            (Transaction.category.ilike(search_fmt)) |
            (Transaction.notes.ilike(search_fmt))
        )

    if txn_type and txn_type in ['income', 'expense']:
        query = query.filter_by(type=txn_type)

    if category and category != 'All':
        query = query.filter_by(category=category)

    if payment_method and payment_method != 'All':
        query = query.filter_by(payment_method=payment_method)

    if start_date:
        try:
            s_dt = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Transaction.date >= s_dt)
        except ValueError:
            pass

    if end_date:
        try:
            e_dt = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Transaction.date <= e_dt)
        except ValueError:
            pass

    # Sorting
    if sort_by == 'date_asc':
        query = query.order_by(Transaction.date.asc(), Transaction.id.asc())
    elif sort_by == 'amount_desc':
        query = query.order_by(Transaction.amount.desc())
    elif sort_by == 'amount_asc':
        query = query.order_by(Transaction.amount.asc())
    else:  # date_desc default
        query = query.order_by(Transaction.date.desc(), Transaction.id.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return success_response({
        "transactions": [t.to_dict() for t in pagination.items],
        "pagination": {
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    }, "Transactions fetched successfully")

@transaction_bp.route('', methods=['POST'])
@jwt_required()
def create_transaction():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    description = data.get('description', '').strip()
    amount = data.get('amount')
    txn_type = data.get('type', 'expense').strip().lower()
    date_str = data.get('date', '').strip()
    category = data.get('category', '').strip()
    payment_method = data.get('payment_method', 'UPI').strip()
    notes = data.get('notes', '').strip()

    if not description or amount is None or not date_str:
        return error_response("Description, amount, and date are required.", 400)

    try:
        amount_val = float(amount)
        if amount_val <= 0:
            return error_response("Amount must be a positive number.", 400)
    except (ValueError, TypeError):
        return error_response("Invalid amount format.", 400)

    try:
        date_val = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return error_response("Invalid date format. Expected YYYY-MM-DD.", 400)

    if not category:
        category = categorize_transaction(description, txn_type)

    txn = Transaction(
        user_id=user_id,
        date=date_val,
        description=description,
        amount=amount_val,
        type=txn_type,
        category=category,
        payment_method=payment_method,
        notes=notes,
        source="manual"
    )

    db.session.add(txn)
    db.session.commit()

    return success_response(txn.to_dict(), "Transaction created successfully", 201)

@transaction_bp.route('/<int:txn_id>', methods=['PUT'])
@jwt_required()
def update_transaction(txn_id):
    user_id = int(get_jwt_identity())
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()

    if not txn:
        return error_response("Transaction not found.", 404)

    data = request.get_json() or {}
    
    if 'description' in data:
        txn.description = data['description'].strip()
    if 'amount' in data:
        try:
            amt = float(data['amount'])
            if amt > 0:
                txn.amount = amt
        except (ValueError, TypeError):
            return error_response("Invalid amount value", 400)
    if 'type' in data and data['type'] in ['income', 'expense']:
        txn.type = data['type']
    if 'category' in data:
        txn.category = data['category'].strip()
    if 'payment_method' in data:
        txn.payment_method = data['payment_method'].strip()
    if 'notes' in data:
        txn.notes = data['notes'].strip()
    if 'date' in data:
        try:
            txn.date = datetime.strptime(data['date'].strip(), '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Expected YYYY-MM-DD.", 400)

    db.session.commit()
    return success_response(txn.to_dict(), "Transaction updated successfully")

@transaction_bp.route('/<int:txn_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(txn_id):
    user_id = int(get_jwt_identity())
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()

    if not txn:
        return error_response("Transaction not found.", 404)

    db.session.delete(txn)
    db.session.commit()
    return success_response({"id": txn_id}, "Transaction deleted successfully")

@transaction_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return success_response([c.to_dict() for c in categories], "Categories fetched")
