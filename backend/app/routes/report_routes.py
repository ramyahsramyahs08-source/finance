from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response
from app.services.report_service import generate_monthly_report, generate_yearly_report

report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@report_bp.route('/monthly', methods=['GET'])
@jwt_required()
def get_monthly_report():
    user_id = int(get_jwt_identity())
    now = datetime.now()
    year = request.args.get('year', now.year, type=int)
    month = request.args.get('month', now.month, type=int)

    if month < 1 or month > 12:
        return error_response("Month must be between 1 and 12", 400)

    report_data = generate_monthly_report(user_id, year, month)
    if not report_data:
        return error_response("Unable to generate monthly report", 404)

    return success_response(report_data, "Monthly report generated successfully")

@report_bp.route('/yearly', methods=['GET'])
@jwt_required()
def get_yearly_report():
    user_id = int(get_jwt_identity())
    now = datetime.now()
    year = request.args.get('year', now.year, type=int)

    report_data = generate_yearly_report(user_id, year)
    if not report_data:
        return error_response("Unable to generate yearly report", 404)

    return success_response(report_data, "Yearly report generated successfully")
