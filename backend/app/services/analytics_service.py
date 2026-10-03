from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from app.models import Transaction, Category

CATEGORY_COLORS = {
    "Food": "#F97316",
    "Travel": "#06B6D4",
    "Shopping": "#EC4899",
    "Bills": "#EAB308",
    "Housing": "#8B5CF6",
    "Entertainment": "#A855F7",
    "Health": "#EF4444",
    "Education": "#3B82F6",
    "Investment": "#10B981",
    "Income": "#22C55E",
    "Others": "#64748B"
}

import calendar

def get_date_range(filter_type, start_date_str=None, end_date_str=None):
    today = datetime.now().date()
    _, cur_last_day = calendar.monthrange(today.year, today.month)
    cur_month_end = today.replace(day=cur_last_day)
    
    if filter_type == "this_month":
        start_date = today.replace(day=1)
        end_date = cur_month_end
    elif filter_type == "last_month":
        first_this_month = today.replace(day=1)
        last_month_end = first_this_month - timedelta(days=1)
        start_date = last_month_end.replace(day=1)
        end_date = last_month_end
    elif filter_type == "3_months":
        start_date = (today - relativedelta(months=3)).replace(day=1)
        end_date = None
    elif filter_type == "6_months":
        start_date = (today - relativedelta(months=6)).replace(day=1)
        end_date = None
    elif filter_type == "this_year":
        start_date = today.replace(month=1, day=1)
        end_date = None
    elif filter_type == "custom" and start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except Exception:
            start_date = (today - relativedelta(months=6)).replace(day=1)
            end_date = None
    else:  # all_time or default
        start_date = None
        end_date = None

    return start_date, end_date

def get_analytics_data(user_id, filter_type="6_months", start_date_str=None, end_date_str=None):
    start_date, end_date = get_date_range(filter_type, start_date_str, end_date_str)
    
    query = Transaction.query.filter_by(user_id=user_id)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
        
    transactions = query.order_by(Transaction.date.asc()).all()

    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expense = sum(t.amount for t in transactions if t.type == 'expense')
    net_savings = total_income - total_expense
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

    # Date span for daily average
    if transactions:
        min_date = transactions[0].date
        max_date = transactions[-1].date
        days_span = max(1, (max_date - min_date).days + 1)
    else:
        days_span = 30
    daily_avg_expense = total_expense / days_span

    # Category Breakdown
    category_expenses = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for t in transactions:
        if t.type == 'expense':
            category_expenses[t.category]["amount"] += t.amount
            category_expenses[t.category]["count"] += 1

    category_breakdown = []
    for cat_name, data in sorted(category_expenses.items(), key=lambda x: x[1]["amount"], reverse=True):
        pct = (data["amount"] / total_expense * 100) if total_expense > 0 else 0
        category_breakdown.append({
            "category": cat_name,
            "amount": round(data["amount"], 2),
            "percentage": round(pct, 1),
            "count": data["count"],
            "color": CATEGORY_COLORS.get(cat_name, "#64748B")
        })

    # Monthly Breakdown
    monthly_agg = defaultdict(lambda: {"income": 0.0, "expense": 0.0, "transactions": 0})
    for t in transactions:
        m_key = t.date.strftime("%Y-%m")
        if t.type == 'income':
            monthly_agg[m_key]["income"] += t.amount
        else:
            monthly_agg[m_key]["expense"] += t.amount
        monthly_agg[m_key]["transactions"] += 1

    monthly_trend = []
    for m_key in sorted(monthly_agg.keys()):
        inc = monthly_agg[m_key]["income"]
        exp = monthly_agg[m_key]["expense"]
        sav = inc - exp
        rate = (sav / inc * 100) if inc > 0 else 0
        dt = datetime.strptime(m_key, "%Y-%m")
        monthly_trend.append({
            "month_key": m_key,
            "month_label": dt.strftime("%b %Y"),
            "short_month": dt.strftime("%b"),
            "income": round(inc, 2),
            "expense": round(exp, 2),
            "savings": round(sav, 2),
            "savings_rate": round(rate, 1),
            "transaction_count": monthly_agg[m_key]["transactions"]
        })

    # Payment Method Breakdown
    payment_methods = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for t in transactions:
        if t.type == 'expense':
            pm = t.payment_method or "Other"
            payment_methods[pm]["amount"] += t.amount
            payment_methods[pm]["count"] += 1

    payment_breakdown = [
        {"method": pm, "amount": round(d["amount"], 2), "count": d["count"]}
        for pm, d in sorted(payment_methods.items(), key=lambda x: x[1]["amount"], reverse=True)
    ]

    # Essential vs Discretionary
    essential_set = {"Food", "Housing", "Bills", "Health", "Education", "Travel"}
    essential_amount = sum(d["amount"] for cat, d in category_expenses.items() if cat in essential_set)
    discretionary_amount = total_expense - essential_amount

    # Top largest expense transactions
    top_expenses = [
        t.to_dict() for t in sorted([t for t in transactions if t.type == 'expense'], key=lambda x: x.amount, reverse=True)[:5]
    ]

    return {
        "summary": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "daily_avg_expense": round(daily_avg_expense, 2),
            "total_transactions": len(transactions),
            "essential_amount": round(essential_amount, 2),
            "discretionary_amount": round(discretionary_amount, 2),
            "essential_ratio": round((essential_amount / total_expense * 100), 1) if total_expense > 0 else 0,
            "discretionary_ratio": round((discretionary_amount / total_expense * 100), 1) if total_expense > 0 else 0
        },
        "category_breakdown": category_breakdown,
        "monthly_trend": monthly_trend,
        "payment_breakdown": payment_breakdown,
        "top_expenses": top_expenses,
        "filter": filter_type
    }
