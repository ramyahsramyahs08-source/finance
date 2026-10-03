from datetime import datetime, timedelta
from collections import defaultdict
from app.models import Transaction, FinancialGoal

class FinancialAdvisorEngine:
    def __init__(self, user_id):
        self.user_id = user_id
        self.transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.asc()).all()
        self.goals = FinancialGoal.query.filter_by(user_id=user_id).all()

    def generate_recommendations(self):
        recommendations = []

        if not self.transactions:
            recommendations.append({
                "id": "welcome-tip",
                "type": "suggestion",
                "badge": "Suggestion",
                "title": "Welcome to Smart Finance Advisor",
                "message": "Upload your bank statement CSV or add your first transaction to unlock customized AI financial recommendations.",
                "action": "Upload Statement",
                "action_url": "/csv-upload",
                "icon": "Sparkles",
                "impact": "High"
            })
            return recommendations

        # Group by months
        monthly_txns = defaultdict(list)
        for t in self.transactions:
            m_key = t.date.strftime("%Y-%m")
            monthly_txns[m_key].append(t)

        sorted_months = sorted(monthly_txns.keys())
        current_month_key = sorted_months[-1] if sorted_months else datetime.now().strftime("%Y-%m")
        prev_month_key = sorted_months[-2] if len(sorted_months) >= 2 else None

        current_txns = monthly_txns[current_month_key]
        prev_txns = monthly_txns[prev_month_key] if prev_month_key else []

        cur_income = sum(t.amount for t in current_txns if t.type == 'income')
        cur_expense = sum(t.amount for t in current_txns if t.type == 'expense')
        cur_savings = cur_income - cur_expense
        cur_savings_rate = (cur_savings / cur_income * 100) if cur_income > 0 else 0

        # Group current and prev expenses by category
        cur_cat_expenses = defaultdict(float)
        for t in current_txns:
            if t.type == 'expense':
                cur_cat_expenses[t.category] += t.amount

        prev_cat_expenses = defaultdict(float)
        for t in prev_txns:
            if t.type == 'expense':
                prev_cat_expenses[t.category] += t.amount

        # 1. RISK & CRITICAL ALERTS: Burn rate check
        if cur_income > 0 and cur_expense > cur_income:
            deficit = cur_expense - cur_income
            recommendations.append({
                "id": "critical-overspending",
                "type": "critical",
                "badge": "Critical Alert",
                "title": "Budget Deficit Warning",
                "message": f"Your current monthly expenses (₹{cur_expense:,.0f}) exceed your income (₹{cur_income:,.0f}) by ₹{deficit:,.0f}. Immediate reduction of non-essential discretionary expenses is recommended.",
                "action": "View Analytics",
                "action_url": "/analytics",
                "icon": "AlertTriangle",
                "impact": "Immediate"
            })
        elif cur_income > 0 and (cur_expense / cur_income) >= 0.85:
            recommendations.append({
                "id": "high-burn-rate",
                "type": "warning",
                "badge": "Warning",
                "title": "High Expense Burn Rate",
                "message": f"You are currently spending {((cur_expense/cur_income)*100):.1f}% of your monthly income. You only have a ₹{cur_savings:,.0f} safety buffer remaining for this cycle.",
                "action": "Optimize Budget",
                "action_url": "/transactions",
                "icon": "ShieldAlert",
                "impact": "High"
            })

        # 2. OVERSPENDING SPIKE DETECTION (Month-over-month category surge)
        if prev_month_key:
            for cat, cur_amt in cur_cat_expenses.items():
                prev_amt = prev_cat_expenses.get(cat, 0)
                if prev_amt >= 1000 and cur_amt > prev_amt * 1.30:  # > 30% increase and significant amount
                    surge_pct = ((cur_amt - prev_amt) / prev_amt) * 100
                    diff_amt = cur_amt - prev_amt
                    recommendations.append({
                        "id": f"surge-{cat.lower()}",
                        "type": "warning",
                        "badge": "Overspending Alert",
                        "title": f"Surge in {cat} Expenditure",
                        "message": f"You spent {surge_pct:.0f}% more on {cat} this month (₹{cur_amt:,.0f} vs ₹{prev_amt:,.0f} last month, +₹{diff_amt:,.0f}). Consider auditing recent transactions.",
                        "action": f"View {cat} Transactions",
                        "action_url": f"/transactions?category={cat}",
                        "icon": "TrendingUp",
                        "impact": "Medium"
                    })

        # 3. SAVINGS OPTIMIZATION RECOMMENDATION
        if cur_income > 0:
            if cur_savings_rate < 20:
                # Calculate how reducing discretionary can boost savings rate
                shopping_dining = cur_cat_expenses.get("Shopping", 0) + cur_cat_expenses.get("Entertainment", 0) + cur_cat_expenses.get("Food", 0) * 0.3
                reducible = min(shopping_dining * 0.25, cur_income * 0.10)
                if reducible >= 1500:
                    potential_savings = cur_savings + reducible
                    potential_rate = (potential_savings / cur_income) * 100
                    recommendations.append({
                        "id": "savings-boost-recommendation",
                        "type": "suggestion",
                        "badge": "Savings Recommendation",
                        "title": "Target 20%+ Savings Milestone",
                        "message": f"Your current savings rate is {cur_savings_rate:.1f}%. Trimming discretionary shopping and entertainment by ₹{reducible:,.0f} could elevate your savings rate to approximately {potential_rate:.1f}%.",
                        "action": "Set Financial Goal",
                        "action_url": "/goals",
                        "icon": "Target",
                        "impact": "High"
                    })
            elif cur_savings_rate >= 30:
                recommendations.append({
                    "id": "investment-opportunity",
                    "type": "positive",
                    "badge": "Wealth Accelerator",
                    "title": "Prime Investment Opportunity",
                    "message": f"Impressive {cur_savings_rate:.1f}% savings rate! With ₹{cur_savings:,.0f} surplus this month, consider allocating a portion toward index funds, SIPs, or emergency reserves.",
                    "action": "Manage Goals",
                    "action_url": "/goals",
                    "icon": "Zap",
                    "impact": "Medium"
                })

        # 4. SPENDING PATTERN INSIGHT: Top Expense Driver
        if cur_cat_expenses:
            top_cat, top_amt = max(cur_cat_expenses.items(), key=lambda x: x[1])
            top_pct = (top_amt / cur_expense * 100) if cur_expense > 0 else 0
            if top_pct >= 25:
                recommendations.append({
                    "id": "top-spending-pattern",
                    "type": "suggestion",
                    "badge": "Spending Pattern",
                    "title": f"{top_cat} is Your Primary Cost Driver",
                    "message": f"{top_cat} accounts for {top_pct:.1f}% (₹{top_amt:,.0f}) of all your monthly expenditures. Keeping tabs here will have the biggest impact on overall savings.",
                    "action": "Category Breakdown",
                    "action_url": "/analytics",
                    "icon": "PieChart",
                    "impact": "Medium"
                })

        # 5. FINANCIAL GOAL PROGRESS INSIGHT
        if self.goals:
            for goal in self.goals:
                progress = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0
                if progress >= 100:
                    recommendations.append({
                        "id": f"goal-achieved-{goal.id}",
                        "type": "positive",
                        "badge": "Goal Milestone",
                        "title": f"Goal Achieved: {goal.name}!",
                        "message": f"Congratulations! You have reached 100% of your target (₹{goal.target_amount:,.0f}) for {goal.name}. Time to celebrate and set your next milestone!",
                        "action": "View Goals",
                        "action_url": "/goals",
                        "icon": "Award",
                        "impact": "High"
                    })
                elif progress < 30 and goal.target_date:
                    days_left = (goal.target_date - datetime.now().date()).days
                    if 0 < days_left < 90:
                        recommendations.append({
                            "id": f"goal-lagging-{goal.id}",
                            "type": "warning",
                            "badge": "Goal Warning",
                            "title": f"{goal.name} Nearing Target Date",
                            "message": f"Your target date for {goal.name} is in {days_left} days with {progress:.0f}% achieved. An additional monthly contribution of ₹{(goal.target_amount - goal.current_amount) / max(1, days_left/30):,.0f} is needed.",
                            "action": "Review Goal",
                            "action_url": "/goals",
                            "icon": "Clock",
                            "impact": "High"
                        })

        # 6. POSITIVE HABIT FEEDBACK
        if prev_month_key and len(sorted_months) >= 2:
            prev_expense = sum(t.amount for t in prev_txns if t.type == 'expense')
            if prev_expense > 0 and cur_expense < prev_expense * 0.95:
                reduction_pct = ((prev_expense - cur_expense) / prev_expense) * 100
                savings_increase = prev_expense - cur_expense
                recommendations.append({
                    "id": "positive-expense-reduction",
                    "type": "positive",
                    "badge": "Positive Momentum",
                    "title": "Reduced Monthly Spending",
                    "message": f"Great job! Your monthly expenditure decreased by {reduction_pct:.1f}% compared to last month, preserving an extra ₹{savings_increase:,.0f} in cash flow.",
                    "action": "View Monthly Comparison",
                    "action_url": "/analytics",
                    "icon": "CheckCircle2",
                    "impact": "High"
                })

        return recommendations

def get_recommendations_for_user(user_id):
    engine = FinancialAdvisorEngine(user_id)
    return engine.generate_recommendations()
