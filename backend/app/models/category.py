from .user import db

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    type = db.Column(db.String(20), nullable=False, default="expense")  # 'expense' or 'income'
    icon = db.Column(db.String(50), default="Tag")
    color = db.Column(db.String(30), default="#6366F1")
    keywords = db.Column(db.Text, default="")  # comma-separated keywords for auto-categorization
    is_essential = db.Column(db.Boolean, default=False)  # For health score calculation

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "icon": self.icon,
            "color": self.color,
            "keywords": [k.strip() for k in self.keywords.split(",") if k.strip()],
            "is_essential": self.is_essential
        }
