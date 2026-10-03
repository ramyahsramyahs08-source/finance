from datetime import datetime
from .user import db

class FinancialGoal(db.Model):
    __tablename__ = 'financial_goals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    target_date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(50), default="Savings")  # 'Emergency Fund', 'Gadget', 'Vehicle', 'Vacation', 'House', 'Education', 'Other'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        progress_percentage = (self.current_amount / self.target_amount * 100) if self.target_amount > 0 else 0
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "target_date": self.target_date.isoformat() if self.target_date else None,
            "category": self.category,
            "progress_percentage": round(min(progress_percentage, 100.0), 1),
            "remaining_amount": max(0.0, self.target_amount - self.current_amount),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
