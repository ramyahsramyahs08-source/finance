from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response
from app.services.advisor_service import get_recommendations_for_user
from app.services.health_score_service import calculate_financial_health_score

advisor_bp = Blueprint('advisor', __name__, url_prefix='/api')

@advisor_bp.route('/advisor/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    user_id = int(get_jwt_identity())
    recommendations = get_recommendations_for_user(user_id)
    return success_response(recommendations, "AI Financial recommendations generated successfully")

@advisor_bp.route('/health-score', methods=['GET'])
@jwt_required()
def get_health_score():
    user_id = int(get_jwt_identity())
    score_data = calculate_financial_health_score(user_id)
    return success_response(score_data, "Financial Health Score calculated successfully")
