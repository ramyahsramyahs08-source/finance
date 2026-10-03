import calendar
from datetime import datetime
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Transaction, User, UploadedStatement
from app.utils.response import success_response, error_response
from app.services.health_score_service import calculate_financial_health_score
from app.services.analytics_service import get_analytics_data
from app.services.advisor_service import get_recommendations_for_user

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)

    all_txns = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc(), Transaction.id.desc()).all()

    # Lifetime metrics
    total_income_lifetime = sum(t.amount for t in all_txns if t.type == 'income')
    total_expense_lifetime = sum(t.amount for t in all_txns if t.type == 'expense')

    # Total Balance Calculation:
    # 1. If user has imported bank statements with a closing balance:
    #    The latest valid closing balance per bank represents the bank account balance as of that statement date.
    #    Any manual/standalone transactions occurring AFTER the latest statement date adjust the balance.
    # 2. If no statements with closing balance exist, balance = lifetime income - lifetime expenses.
    statements = UploadedStatement.query.filter_by(user_id=user_id).order_by(UploadedStatement.upload_date.desc()).all()
    statements_with_balance = [s for s in statements if s.closing_balance is not None]

    if statements_with_balance:
        # Latest statement per bank
        bank_latest_statement = {}
        for s in statements_with_balance:
            if s.bank_name not in bank_latest_statement:
                bank_latest_statement[s.bank_name] = s

        statement_total = sum(s.closing_balance for s in bank_latest_statement.values())
        stmt_ids = {s.id for s in bank_latest_statement.values()}

        # Find latest transaction date across these statements
        stmt_txns = [t for t in all_txns if t.statement_id in stmt_ids]
        latest_stmt_date = max((t.date for t in stmt_txns), default=None)

        # Subsequent manual transactions that occurred after the latest statement date
        subsequent_manual_income = sum(
            t.amount for t in all_txns
            if t.statement_id is None and (latest_stmt_date is None or t.date > latest_stmt_date) and t.type == 'income'
        )
        subsequent_manual_expense = sum(
            t.amount for t in all_txns
            if t.statement_id is None and (latest_stmt_date is None or t.date > latest_stmt_date) and t.type == 'expense'
        )
        total_balance = statement_total + subsequent_manual_income - subsequent_manual_expense
    else:
        total_balance = total_income_lifetime - total_expense_lifetime

    # Active / Current month metrics:
    today = datetime.now().date()
    cur_month_start = today.replace(day=1)
    _, cur_last_day = calendar.monthrange(today.year, today.month)
    cur_month_end = today.replace(day=cur_last_day)

    current_month_txns = [t for t in all_txns if cur_month_start <= t.date <= cur_month_end]

    # If no transactions in current calendar month yet, fall back to most recent active month
    if not current_month_txns and all_txns:
        latest_date = all_txns[0].date
        active_month_start = latest_date.replace(day=1)
        _, active_last_day = calendar.monthrange(latest_date.year, latest_date.month)
        active_month_end = latest_date.replace(day=active_last_day)
        active_txns = [t for t in all_txns if active_month_start <= t.date <= active_month_end]
    else:
        active_txns = current_month_txns

    monthly_income = sum(t.amount for t in active_txns if t.type == 'income')
    monthly_expense = sum(t.amount for t in active_txns if t.type == 'expense')
    monthly_savings = monthly_income - monthly_expense
    savings_rate = (monthly_savings / monthly_income * 100) if monthly_income > 0 else 0

    # Analytics for 6 months (charts)
    analytics = get_analytics_data(user_id, filter_type="6_months")
    
    # Health Score
    health_score = calculate_financial_health_score(user_id)

    # AI Recommendations (top 2 for dashboard preview)
    ai_recommendations = get_recommendations_for_user(user_id)[:3]

    # Recent Transactions (latest 6)
    recent_transactions = [t.to_dict() for t in all_txns[:6]]

    return success_response({
        "user": user.to_dict(),
        "metrics": {
            "total_balance": round(total_balance, 2),
            "monthly_income": round(monthly_income, 2),
            "monthly_expense": round(monthly_expense, 2),
            "monthly_savings": round(monthly_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "health_score": health_score["score"],
            "health_status": health_score["status"],
            "health_color": health_score["color"]
        },
        "health_score_detail": health_score,
        "category_breakdown": analytics["category_breakdown"][:8],
        "monthly_trend": analytics["monthly_trend"],
        "recent_transactions": recent_transactions,
        "ai_recommendations": ai_recommendations
    }, "Dashboard data fetched successfully")
