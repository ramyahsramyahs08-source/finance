from datetime import datetime, timedelta
from app.models import Transaction, Category

def calculate_financial_health_score(user_id):
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    
    if not transactions:
        return {
            "score": 50,
            "status": "Needs Attention",
            "color": "#EAB308",
            "summary": "No transaction history recorded yet. Start tracking transactions to unlock a personalized score.",
            "factors": [
                {"name": "Savings Rate", "score": 10, "max_score": 20, "description": "Insufficient data"},
                {"name": "Expense Control", "score": 10, "max_score": 20, "description": "Insufficient data"},
                {"name": "Cash Flow", "score": 10, "max_score": 20, "description": "Insufficient data"},
                {"name": "Consistency", "score": 10, "max_score": 20, "description": "Insufficient data"},
                {"name": "Spending Habits", "score": 10, "max_score": 20, "description": "Insufficient data"}
            ]
        }

    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expense = sum(t.amount for t in transactions if t.type == 'expense')
    net_savings = total_income - total_expense

    # 1. Savings Rate Score (0 - 20)
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0
    if savings_rate >= 35:
        savings_score = 20
        savings_desc = f"Outstanding savings rate ({savings_rate:.1f}%)"
    elif savings_rate >= 25:
        savings_score = 17
        savings_desc = f"Healthy savings rate ({savings_rate:.1f}%)"
    elif savings_rate >= 15:
        savings_score = 13
        savings_desc = f"Moderate savings rate ({savings_rate:.1f}%)"
    elif savings_rate > 0:
        savings_score = 8
        savings_desc = f"Low savings rate ({savings_rate:.1f}%). Target >= 20%"
    else:
        savings_score = 2
        savings_desc = "Deficit: Expenses currently exceed income"

    # 2. Expense Control Score (0 - 20)
    expense_ratio = (total_expense / total_income * 100) if total_income > 0 else 100
    if expense_ratio <= 50:
        expense_score = 20
        expense_desc = "Exceptional expenditure control (< 50% of income)"
    elif expense_ratio <= 70:
        expense_score = 16
        expense_desc = "Controlled spending (< 70% of income)"
    elif expense_ratio <= 85:
        expense_score = 11
        expense_desc = "Elevated expenses (70%–85% of income)"
    elif expense_ratio <= 100:
        expense_score = 6
        expense_desc = "High burn rate (85%–100% of income)"
    else:
        expense_score = 2
        expense_desc = "Overspending: Expenses exceed total income"

    # 3. Cash Flow Score (0 - 20)
    # Analyze by month
    monthly_data = {}
    for t in transactions:
        month_key = t.date.strftime("%Y-%m")
        if month_key not in monthly_data:
            monthly_data[month_key] = {"income": 0, "expense": 0}
        if t.type == "income":
            monthly_data[month_key]["income"] += t.amount
        else:
            monthly_data[month_key]["expense"] += t.amount

    positive_months = sum(1 for m, d in monthly_data.items() if d["income"] >= d["expense"])
    total_months = max(1, len(monthly_data))
    cash_flow_ratio = positive_months / total_months
    cash_flow_score = round(cash_flow_ratio * 20)
    cash_flow_desc = f"{positive_months} of {total_months} months with positive cash flow"

    # 4. Consistency Score (0 - 20)
    if len(monthly_data) > 1:
        expenses_list = [d["expense"] for d in monthly_data.values()]
        avg_exp = sum(expenses_list) / len(expenses_list)
        if avg_exp > 0:
            variance = sum((x - avg_exp) ** 2 for x in expenses_list) / len(expenses_list)
            std_dev = variance ** 0.5
            cv = (std_dev / avg_exp)  # coefficient of variation
            if cv < 0.2:
                consistency_score = 20
                consistency_desc = "Highly predictable monthly expenditure"
            elif cv < 0.4:
                consistency_score = 16
                consistency_desc = "Good month-over-month spending consistency"
            elif cv < 0.6:
                consistency_score = 12
                consistency_desc = "Moderate spending fluctuations"
            else:
                consistency_score = 8
                consistency_desc = "High volatility in monthly spending"
        else:
            consistency_score = 15
            consistency_desc = "Consistent baseline"
    else:
        consistency_score = 14
        consistency_desc = "Single month baseline established"

    # 5. Essential vs Discretionary Spending Habits (0 - 20)
    essential_categories = {"Food", "Housing", "Bills", "Health", "Education", "Travel"}
    essential_spend = sum(t.amount for t in transactions if t.type == 'expense' and t.category in essential_categories)
    discretionary_spend = total_expense - essential_spend

    if total_expense > 0:
        disc_ratio = (discretionary_spend / total_expense) * 100
        if disc_ratio <= 30:
            habits_score = 20
            habits_desc = "Disciplined budget: Discretionary spend <= 30%"
        elif disc_ratio <= 45:
            habits_score = 16
            habits_desc = "Balanced lifestyle spending (< 45% discretionary)"
        elif disc_ratio <= 60:
            habits_score = 11
            habits_desc = "High discretionary spending (45%–60%)"
        else:
            habits_score = 6
            habits_desc = "Excessive discretionary spending (> 60% of expenses)"
    else:
        habits_score = 15
        habits_desc = "Healthy allocation"

    total_score = min(100, max(0, savings_score + expense_score + cash_flow_score + consistency_score + habits_score))

    if total_score >= 80:
        status = "Excellent"
        color = "#10B981"  # Emerald
        summary = "Outstanding financial discipline! You have robust savings, controlled discretionary spending, and consistent cash flow."
    elif total_score >= 60:
        status = "Healthy"
        color = "#3B82F6"  # Blue
        summary = "Solid financial foundation. Focus on trimming non-essential subscriptions and scaling monthly savings towards targets."
    elif total_score >= 40:
        status = "Needs Attention"
        color = "#F59E0B"  # Amber
        summary = "Your expenses are close to income limits or volatile. Prioritize creating a 3-month emergency fund and trimming discretionary shopping."
    else:
        status = "Critical"
        color = "#EF4444"  # Red
        summary = "High financial stress detected. Expenses exceed or match total income. Implement a strict zero-based budget immediately."

    return {
        "score": total_score,
        "status": status,
        "color": color,
        "summary": summary,
        "metrics": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "expense_ratio": round(expense_ratio, 1)
        },
        "factors": [
            {"name": "Savings Rate", "score": savings_score, "max_score": 20, "description": savings_desc},
            {"name": "Expense Control", "score": expense_score, "max_score": 20, "description": expense_desc},
            {"name": "Cash Flow", "score": cash_flow_score, "max_score": 20, "description": cash_flow_desc},
            {"name": "Consistency", "score": consistency_score, "max_score": 20, "description": consistency_desc},
            {"name": "Spending Habits", "score": habits_score, "max_score": 20, "description": habits_desc}
        ]
    }
