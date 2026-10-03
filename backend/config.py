import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "smart-finance-advisor-jwt-secret-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "smart-finance-advisor-jwt-token-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Database URI (PostgreSQL, Vercel serverless /tmp SQLite, or local SQLite)
    _db_url = os.getenv("DATABASE_URL")
    if _db_url and _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)

    if _db_url:
        SQLALCHEMY_DATABASE_URI = _db_url
    elif os.getenv("VERCEL"):
        import shutil
        tmp_db = "/tmp/smart_finance.db"
        local_db = os.path.join(BASE_DIR, "smart_finance.db")
        if not os.path.exists(tmp_db) and os.path.exists(local_db):
            try:
                shutil.copy2(local_db, tmp_db)
            except Exception:
                pass
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{tmp_db}"
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'smart_finance.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload folder configuration
    if os.getenv("VERCEL"):
        UPLOAD_FOLDER = "/tmp/uploads"
    else:
        UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    ALLOWED_EXTENSIONS = {"csv"}
