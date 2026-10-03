from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.models import FinancialGoal, db

def calculate_goal_metrics(goal: FinancialGoal):
    today = datetime.now().date()
    progress_pct = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0
    remaining = max(0.0, goal.target_amount - goal.current_amount)

    days_remaining = (goal.target_date - today).days if goal.target_date else 0
    
    # Calculate months left
    if goal.target_date and goal.target_date > today:
        delta = relativedelta(goal.target_date, today)
        months_left = max(1, delta.years * 12 + delta.months + (1 if delta.days > 0 else 0))
    else:
        months_left = 0

    monthly_needed = (remaining / months_left) if months_left > 0 else remaining

    if progress_pct >= 100:
        status = "Completed"
        status_color = "#10B981"
    elif days_remaining < 0:
        status = "Past Due"
        status_color = "#EF4444"
    elif progress_pct >= 60:
        status = "On Track"
        status_color = "#3B82F6"
    else:
        status = "In Progress"
        status_color = "#F59E0B"

    return {
        "id": goal.id,
        "name": goal.name,
        "category": goal.category,
        "target_amount": round(goal.target_amount, 2),
        "current_amount": round(goal.current_amount, 2),
        "remaining_amount": round(remaining, 2),
        "target_date": goal.target_date.isoformat() if goal.target_date else None,
        "progress_percentage": round(min(progress_pct, 100.0), 1),
        "days_remaining": max(0, days_remaining),
        "months_remaining": months_left,
        "recommended_monthly_saving": round(monthly_needed, 2),
        "status": status,
        "status_color": status_color,
        "created_at": goal.created_at.isoformat() if goal.created_at else None
    }

def get_user_goals_with_metrics(user_id):
    goals = FinancialGoal.query.filter_by(user_id=user_id).order_by(FinancialGoal.target_date.asc()).all()
    goals_data = [calculate_goal_metrics(g) for g in goals]
    
    total_target = sum(g.target_amount for g in goals)
    total_saved = sum(g.current_amount for g in goals)
    overall_progress = (total_saved / total_target * 100) if total_target > 0 else 0
    total_monthly_needed = sum(g["recommended_monthly_saving"] for g in goals_data if g["status"] != "Completed")

    return {
        "goals": goals_data,
        "summary": {
            "total_goals": len(goals),
            "completed_goals": sum(1 for g in goals_data if g["status"] == "Completed"),
            "total_target_amount": round(total_target, 2),
            "total_saved_amount": round(total_saved, 2),
            "overall_progress": round(min(overall_progress, 100.0), 1),
            "total_monthly_needed": round(total_monthly_needed, 2)
        }
    }
