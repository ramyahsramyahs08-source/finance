from datetime import datetime
from collections import defaultdict
from app.models import Transaction, User
from app.services.health_score_service import calculate_financial_health_score
from app.services.advisor_service import get_recommendations_for_user

def generate_monthly_report(user_id, year, month):
    user = User.query.get(user_id)
    if not user:
        return None

    try:
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date()
        else:
            end_date = datetime(year, month + 1, 1).date()
    except Exception:
        now = datetime.now()
        start_date = datetime(now.year, now.month, 1).date()
        end_date = now.date()

    txns = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.date >= start_date,
        Transaction.date < end_date
    ).order_by(Transaction.date.desc()).all()

    total_income = sum(t.amount for t in txns if t.type == 'income')
    total_expense = sum(t.amount for t in txns if t.type == 'expense')
    net_savings = total_income - total_expense
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

    # Category breakdown
    cat_expenses = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for t in txns:
        if t.type == 'expense':
            cat_expenses[t.category]["amount"] += t.amount
            cat_expenses[t.category]["count"] += 1

    category_summary = []
    for cat_name, data in sorted(cat_expenses.items(), key=lambda x: x[1]["amount"], reverse=True):
        pct = (data["amount"] / total_expense * 100) if total_expense > 0 else 0
        category_summary.append({
            "category": cat_name,
            "amount": round(data["amount"], 2),
            "percentage": round(pct, 1),
            "count": data["count"]
        })

    health_score_data = calculate_financial_health_score(user_id)
    recommendations = get_recommendations_for_user(user_id)

    month_name = start_date.strftime("%B %Y")

    return {
        "report_type": "Monthly",
        "period": month_name,
        "year": year,
        "month": month,
        "user": user.to_dict(),
        "generated_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "summary": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "transaction_count": len(txns)
        },
        "category_summary": category_summary,
        "health_score": health_score_data,
        "top_transactions": [t.to_dict() for t in txns[:15]],
        "recommendations": recommendations[:4]
    }

def generate_yearly_report(user_id, year):
    user = User.query.get(user_id)
    if not user:
        return None

    start_date = datetime(year, 1, 1).date()
    end_date = datetime(year + 1, 1, 1).date()

    txns = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.date >= start_date,
        Transaction.date < end_date
    ).order_by(Transaction.date.asc()).all()

    total_income = sum(t.amount for t in txns if t.type == 'income')
    total_expense = sum(t.amount for t in txns if t.type == 'expense')
    net_savings = total_income - total_expense
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

    # Monthly breakdown
    monthly_data = defaultdict(lambda: {"income": 0.0, "expense": 0.0, "transactions": 0})
    cat_expenses = defaultdict(lambda: {"amount": 0.0, "count": 0})

    for t in txns:
        m_key = t.date.strftime("%Y-%m")
        if t.type == 'income':
            monthly_data[m_key]["income"] += t.amount
        else:
            monthly_data[m_key]["expense"] += t.amount
            cat_expenses[t.category]["amount"] += t.amount
            cat_expenses[t.category]["count"] += 1
        monthly_data[m_key]["transactions"] += 1

    monthly_table = []
    for m in range(1, 13):
        m_key = f"{year:04d}-{m:02d}"
        m_dt = datetime(year, m, 1)
        data = monthly_data.get(m_key, {"income": 0.0, "expense": 0.0, "transactions": 0})
        sav = data["income"] - data["expense"]
        rate = (sav / data["income"] * 100) if data["income"] > 0 else 0
        monthly_table.append({
            "month": m_dt.strftime("%B"),
            "income": round(data["income"], 2),
            "expense": round(data["expense"], 2),
            "savings": round(sav, 2),
            "savings_rate": round(rate, 1),
            "count": data["transactions"]
        })

    category_summary = []
    for cat_name, data in sorted(cat_expenses.items(), key=lambda x: x[1]["amount"], reverse=True):
        pct = (data["amount"] / total_expense * 100) if total_expense > 0 else 0
        category_summary.append({
            "category": cat_name,
            "amount": round(data["amount"], 2),
            "percentage": round(pct, 1),
            "count": data["count"]
        })

    health_score_data = calculate_financial_health_score(user_id)

    return {
        "report_type": "Yearly",
        "period": f"Annual Summary {year}",
        "year": year,
        "user": user.to_dict(),
        "generated_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "summary": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "monthly_avg_expense": round(total_expense / 12, 2),
            "monthly_avg_income": round(total_income / 12, 2),
            "transaction_count": len(txns)
        },
        "monthly_table": monthly_table,
        "category_summary": category_summary,
        "health_score": health_score_data
    }
