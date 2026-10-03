from datetime import datetime
from .user import db

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'
    category = db.Column(db.String(80), nullable=False, default="Others", index=True)
    payment_method = db.Column(db.String(50), default="UPI")  # 'UPI', 'Debit Card', 'Credit Card', 'Cash', 'Bank Transfer', 'Other'
    balance = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    source = db.Column(db.String(30), default="manual")  # 'manual' or 'csv'
    statement_id = db.Column(db.Integer, db.ForeignKey('uploaded_statements.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "description": self.description,
            "amount": self.amount,
            "type": self.type,
            "category": self.category,
            "payment_method": self.payment_method,
            "balance": self.balance,
            "notes": self.notes,
            "source": self.source,
            "statement_id": self.statement_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
