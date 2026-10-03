import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.models import db
from config import Config

jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure uploads directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Production CORS configuration
    cors_origins_env = os.getenv("CORS_ORIGINS", "*").strip()
    if cors_origins_env and cors_origins_env != "*":
        allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
        for dev_url in ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]:
            if dev_url not in allowed_origins:
                allowed_origins.append(dev_url)
        CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
    else:
        CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.transaction_routes import transaction_bp
    from app.routes.csv_routes import csv_bp
    from app.routes.analytics_routes import analytics_bp
    from app.routes.advisor_routes import advisor_bp
    from app.routes.goal_routes import goal_bp
    from app.routes.report_routes import report_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(csv_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(advisor_bp)
    app.register_blueprint(goal_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(user_bp)

    from flask import send_from_directory
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path in ('', 'index.html', 'api/index.py', 'index.py'):
            if os.path.exists(os.path.join(frontend_dist, 'index.html')):
                return send_from_directory(frontend_dist, 'index.html')
            return {"status": "online", "app": "Smart AI-Based Personal Finance Advisor API"}
        if path.startswith('api'):
            return {"error": f"API endpoint /{path} not found"}, 404
        if path and os.path.exists(os.path.join(frontend_dist, path)):
            return send_from_directory(frontend_dist, path)
        if os.path.exists(os.path.join(frontend_dist, 'index.html')):
            return send_from_directory(frontend_dist, 'index.html')
        return send_from_directory(frontend_dist, 'index.html')

    @app.route('/api/debug-env')
    @app.route('/debug-env')
    def debug_env():
        import flask
        return {
            "path": flask.request.path,
            "full_path": flask.request.full_path,
            "environ_PATH_INFO": flask.request.environ.get("PATH_INFO"),
            "headers": dict(flask.request.headers)
        }

    # Create tables automatically and ensure columns exist
    with app.app_context():
        db.create_all()
        from sqlalchemy import text
        try:
            db.session.execute(text("ALTER TABLE uploaded_statements ADD COLUMN closing_balance FLOAT"))
            db.session.commit()
        except Exception:
            db.session.rollback()
        try:
            db.session.execute(text("ALTER TABLE transactions ADD COLUMN balance FLOAT"))
            db.session.commit()
        except Exception:
            db.session.rollback()

        from app.services.seed_service import seed_categories
        seed_categories()

    return app
