from datetime import datetime
from .user import db

class UploadedStatement(db.Model):
    __tablename__ = 'uploaded_statements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_rows = db.Column(db.Integer, default=0)
    successful_rows = db.Column(db.Integer, default=0)
    duplicate_rows = db.Column(db.Integer, default=0)
    invalid_rows = db.Column(db.Integer, default=0)
    bank_name = db.Column(db.String(100), default="Unknown Bank")
    closing_balance = db.Column(db.Float, nullable=True)

    # Relationships
    transactions = db.relationship('Transaction', backref='statement', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "upload_date": self.upload_date.isoformat() if self.upload_date else None,
            "total_rows": self.total_rows,
            "successful_rows": self.successful_rows,
            "duplicate_rows": self.duplicate_rows,
            "invalid_rows": self.invalid_rows,
            "bank_name": self.bank_name,
            "closing_balance": self.closing_balance
        }
