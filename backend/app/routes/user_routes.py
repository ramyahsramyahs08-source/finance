from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User, Transaction, FinancialGoal, UploadedStatement
from app.utils.response import success_response, error_response
from app.services.seed_service import seed_demo_user

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)
    return success_response(user.to_dict(), "Profile retrieved")

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)

    data = request.get_json() or {}
    if 'name' in data:
        user.name = data['name'].strip()
    if 'currency' in data:
        user.currency = data['currency'].strip()
    if 'monthly_budget' in data:
        try:
            user.monthly_budget = float(data['monthly_budget'])
        except (ValueError, TypeError):
            pass

    db.session.commit()
    return success_response(user.to_dict(), "Profile updated successfully")

@user_bp.route('/password', methods=['PUT'])
@jwt_required()
def update_password():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)

    data = request.get_json() or {}
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if not current_password or not new_password:
        return error_response("Current and new passwords are required.", 400)

    if not user.check_password(current_password):
        return error_response("Incorrect current password.", 400)

    if len(new_password) < 6:
        return error_response("New password must be at least 6 characters.", 400)

    user.set_password(new_password)
    db.session.commit()
    return success_response(None, "Password updated successfully")

@user_bp.route('/seed-demo-data', methods=['POST'])
@jwt_required()
def seed_data_for_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)

    # Seed demo data for this user
    seed_demo_user(email=user.email, name=user.name)
    return success_response(None, "Demo transactions and goals generated successfully!")

@user_bp.route('/reset-data', methods=['POST'])
@jwt_required()
def reset_user_data():
    user_id = int(get_jwt_identity())
    Transaction.query.filter_by(user_id=user_id).delete()
    FinancialGoal.query.filter_by(user_id=user_id).delete()
    UploadedStatement.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return success_response(None, "All transactions and goals have been reset.")
