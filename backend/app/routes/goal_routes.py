from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, FinancialGoal
from app.utils.response import success_response, error_response
from app.services.goal_service import get_user_goals_with_metrics

goal_bp = Blueprint('goals', __name__, url_prefix='/api/goals')

@goal_bp.route('', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = int(get_jwt_identity())
    result = get_user_goals_with_metrics(user_id)
    return success_response(result, "Goals retrieved successfully")

@goal_bp.route('', methods=['POST'])
@jwt_required()
def create_goal():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    target_amount = data.get('target_amount')
    current_amount = data.get('current_amount', 0.0)
    target_date_str = data.get('target_date', '').strip()
    category = data.get('category', 'Savings').strip()

    if not name or target_amount is None or not target_date_str:
        return error_response("Goal name, target amount, and target date are required.", 400)

    try:
        target_amt_val = float(target_amount)
        current_amt_val = float(current_amount) if current_amount else 0.0
        if target_amt_val <= 0:
            return error_response("Target amount must be greater than zero.", 400)
    except (ValueError, TypeError):
        return error_response("Invalid numeric value for target or current amount.", 400)

    try:
        target_date_val = datetime.strptime(target_date_str, '%Y-%m-%d').date()
    except ValueError:
        return error_response("Invalid date format. Expected YYYY-MM-DD.", 400)

    goal = FinancialGoal(
        user_id=user_id,
        name=name,
        target_amount=target_amt_val,
        current_amount=current_amt_val,
        target_date=target_date_val,
        category=category
    )

    db.session.add(goal)
    db.session.commit()

    return success_response(goal.to_dict(), "Goal created successfully", 201)

@goal_bp.route('/<int:goal_id>', methods=['PUT'])
@jwt_required()
def update_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = FinancialGoal.query.filter_by(id=goal_id, user_id=user_id).first()

    if not goal:
        return error_response("Goal not found.", 404)

    data = request.get_json() or {}

    if 'name' in data:
        goal.name = data['name'].strip()
    if 'target_amount' in data:
        try:
            val = float(data['target_amount'])
            if val > 0:
                goal.target_amount = val
        except (ValueError, TypeError):
            return error_response("Invalid target amount", 400)
    if 'current_amount' in data:
        try:
            val = float(data['current_amount'])
            if val >= 0:
                goal.current_amount = val
        except (ValueError, TypeError):
            return error_response("Invalid current amount", 400)
    if 'target_date' in data:
        try:
            goal.target_date = datetime.strptime(data['target_date'].strip(), '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Expected YYYY-MM-DD.", 400)
    if 'category' in data:
        goal.category = data['category'].strip()

    db.session.commit()
    return success_response(goal.to_dict(), "Goal updated successfully")

@goal_bp.route('/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = FinancialGoal.query.filter_by(id=goal_id, user_id=user_id).first()

    if not goal:
        return error_response("Goal not found.", 404)

    db.session.delete(goal)
    db.session.commit()
    return success_response({"id": goal_id}, "Goal deleted successfully")
