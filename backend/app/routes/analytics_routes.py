from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response
from app.services.analytics_service import get_analytics_data

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('', methods=['GET'])
@jwt_required()
def get_analytics():
    user_id = int(get_jwt_identity())
    filter_type = request.args.get('filter', '6_months')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    data = get_analytics_data(
        user_id=user_id,
        filter_type=filter_type,
        start_date_str=start_date,
        end_date_str=end_date
    )
    return success_response(data, "Analytics data retrieved successfully")

@analytics_bp.route('/category', methods=['GET'])
@jwt_required()
def get_category_analytics():
    user_id = int(get_jwt_identity())
    filter_type = request.args.get('filter', 'this_month')
    data = get_analytics_data(user_id=user_id, filter_type=filter_type)
    return success_response(data["category_breakdown"], "Category breakdown retrieved")

@analytics_bp.route('/monthly', methods=['GET'])
@jwt_required()
def get_monthly_analytics():
    user_id = int(get_jwt_identity())
    data = get_analytics_data(user_id=user_id, filter_type="this_year")
    return success_response(data["monthly_trend"], "Monthly trends retrieved")
