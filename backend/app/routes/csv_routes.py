import os
import uuid
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.models import UploadedStatement, db
from app.utils.response import success_response, error_response
from app.services.csv_service import process_csv_file, import_transactions_from_data

csv_bp = Blueprint('csv', __name__, url_prefix='/api/csv')

@csv_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_csv():
    user_id = int(get_jwt_identity())

    if 'file' not in request.files:
        return error_response("No file provided in request.", 400)

    file = request.files['file']
    if file.filename == '':
        return error_response("No file selected.", 400)

    if not file.filename.lower().endswith('.csv'):
        return error_response("Invalid file type. Only CSV files (.csv) are supported.", 400)

    # Save temp file
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    temp_path = os.path.join(upload_folder, unique_filename)
    file.save(temp_path)

    try:
        result = process_csv_file(temp_path, user_id, original_filename=file.filename)
        
        if not result["success"]:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return error_response(result["error"], 400)

        # Store temp filepath reference in response for confirmation
        result["temp_file_key"] = unique_filename
        return success_response(result, "CSV processed successfully. Review preview before importing.")

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return error_response(f"Error processing CSV: {str(e)}", 500)

@csv_bp.route('/import', methods=['POST'])
@jwt_required()
def import_csv():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    transactions_data = data.get('transactions', [])
    filename = data.get('filename', 'bank_statement.csv')
    bank_name = data.get('bank_name', 'Bank')

    if not transactions_data:
        return error_response("No transactions data provided for import.", 400)

    try:
        import_result = import_transactions_from_data(
            user_id=user_id,
            transactions_data=transactions_data,
            filename=filename,
            bank_name=bank_name
        )
        return success_response(import_result, "Transactions imported successfully", 201)
    except Exception as e:
        return error_response(f"Import failed: {str(e)}", 500)

@csv_bp.route('/history', methods=['GET'])
@jwt_required()
def get_upload_history():
    user_id = int(get_jwt_identity())
    statements = UploadedStatement.query.filter_by(user_id=user_id).order_by(UploadedStatement.upload_date.desc()).all()
    return success_response([s.to_dict() for s in statements], "Upload history fetched")
