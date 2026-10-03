from app import create_app
from app.services.seed_service import seed_demo_user

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        print(">>> Seeding Smart Finance Advisor database...")
        user = seed_demo_user()
        print(f"[OK] Demo user created: {user.email} (Password: demo12345)")
        print("[OK] 6 months of historical transactions and financial goals seeded successfully!")
