from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import db, User
from app.utils.response import success_response, error_response
from app.services.seed_service import seed_categories

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not name or not email or not password:
        return error_response("Full name, email, and password are required.", 400)

    if len(password) < 6:
        return error_response("Password must be at least 6 characters.", 400)

    if confirm_password and password != confirm_password:
        return error_response("Passwords do not match.", 400)

    if User.query.filter_by(email=email).first():
        return error_response("An account with this email already exists.", 409)

    seed_categories()
    
    user = User(
        name=name,
        email=email,
        currency="INR"
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))

    return success_response({
        "user": user.to_dict(),
        "token": token
    }, "Registration successful", 201)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return error_response("Email and password are required.", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response("Invalid email or password.", 401)

    token = create_access_token(identity=str(user.id))

    return success_response({
        "user": user.to_dict(),
        "token": token
    }, "Login successful")

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found.", 404)
    return success_response(user.to_dict(), "User profile fetched successfully")

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    if not email:
        return error_response("Email is required.", 400)

    user = User.query.filter_by(email=email).first()
    # Return friendly mock reset instruction
    return success_response({
        "email": email,
        "reset_sent": True
    }, "If an account exists with this email, a password reset link has been dispatched.")
