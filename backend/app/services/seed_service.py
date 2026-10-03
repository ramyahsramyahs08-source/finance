import random
from datetime import datetime, timedelta
from app.models import db, User, Transaction, Category, FinancialGoal
from app.services.categorizer_service import get_default_categories

SAMPLE_TRANSACTION_TEMPLATES = [
    # Food
    ("Swiggy Order - Lunch", 350, 750, "expense", "Food", "UPI"),
    ("Zomato Delivery - Dinner", 420, 950, "expense", "Food", "UPI"),
    ("Starbucks Coffee", 320, 480, "expense", "Food", "Debit Card"),
    ("Blinkit Grocery Delivery", 850, 2400, "expense", "Food", "UPI"),
    ("Zepto Quick Essentials", 400, 1100, "expense", "Food", "UPI"),
    ("Local Supermarket Weekly Groceries", 2500, 4500, "expense", "Food", "Credit Card"),
    ("Chai Point Evening Snacks", 120, 250, "expense", "Food", "UPI"),

    # Travel
    ("Uber Ride to Office", 280, 520, "expense", "Travel", "UPI"),
    ("Ola Cab Return Trip", 260, 490, "expense", "Travel", "UPI"),
    ("HPCL Petrol Pump Fuel", 1500, 2800, "expense", "Travel", "Credit Card"),
    ("Metro Card Monthly Recharge", 800, 1200, "expense", "Travel", "UPI"),
    ("Fastag Toll Payment", 150, 350, "expense", "Travel", "UPI"),

    # Shopping
    ("Amazon Online Order - Electronics", 1200, 4500, "expense", "Shopping", "Credit Card"),
    ("Myntra Clothing Purchase", 1500, 3200, "expense", "Shopping", "Credit Card"),
    ("Flipkart Home Accessories", 800, 2200, "expense", "Shopping", "UPI"),
    ("Decathlon Sports Gear", 900, 2600, "expense", "Shopping", "Debit Card"),

    # Bills & Housing
    ("Bescom Electricity Bill", 1200, 2200, "expense", "Bills", "UPI"),
    ("Airtel Broadband Fiber Internet", 999, 1499, "expense", "Bills", "UPI"),
    ("Mobile Postpaid Recharge", 499, 799, "expense", "Bills", "UPI"),
    ("Society Maintenance Charges", 2500, 3500, "expense", "Bills", "Bank Transfer"),
    ("Apartment Monthly Rent", 22000, 25000, "expense", "Housing", "Bank Transfer"),

    # Entertainment
    ("Netflix Premium Subscription", 649, 649, "expense", "Entertainment", "Credit Card"),
    ("Spotify Family Plan", 179, 179, "expense", "Entertainment", "UPI"),
    ("BookMyShow Movie Tickets (PVR)", 700, 1400, "expense", "Entertainment", "UPI"),
    ("Hotstar Super Annual", 899, 899, "expense", "Entertainment", "UPI"),

    # Health
    ("Apollo Pharmacy Medicines", 450, 1600, "expense", "Health", "UPI"),
    ("Cult.fit Gym Monthly Pass", 1800, 2500, "expense", "Health", "Credit Card"),
    ("Dental Checkup & Cleaning", 800, 1500, "expense", "Health", "UPI"),

    # Investments
    ("Zerodha Mutual Fund SIP - Nifty 50", 10000, 15000, "expense", "Investment", "Bank Transfer"),
    ("Groww ELSS Tax Saver SIP", 5000, 5000, "expense", "Investment", "Bank Transfer"),
]

def seed_categories():
    for cat_data in get_default_categories():
        existing = Category.query.filter_by(name=cat_data["name"]).first()
        if not existing:
            cat = Category(
                name=cat_data["name"],
                type=cat_data["type"],
                icon=cat_data["icon"],
                color=cat_data["color"],
                keywords=cat_data["keywords"],
                is_essential=cat_data["is_essential"]
            )
            db.session.add(cat)
    db.session.commit()

def seed_demo_user(email="demo@smartfinance.com", password="demo12345", name="Aarav Sharma"):
    seed_categories()

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            currency="INR",
            monthly_budget=55000.0
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
    else:
        # Clear existing demo transactions to reseed cleanly
        Transaction.query.filter_by(user_id=user.id).delete()
        FinancialGoal.query.filter_by(user_id=user.id).delete()
        db.session.commit()

    # Generate 6 months of historical transactions (e.g., from 180 days ago to today)
    today = datetime.now().date()
    start_date = today - timedelta(days=180)

    # Monthly salary credit on 1st of each month
    current_iter_date = start_date.replace(day=1)
    while current_iter_date <= today:
        salary_txn = Transaction(
            user_id=user.id,
            date=current_iter_date,
            description="Monthly Corporate Salary Credit - Infosys Ltd",
            amount=85000.0,
            type="income",
            category="Income",
            payment_method="Bank Transfer",
            notes="Regular monthly payroll",
            source="manual"
        )
        db.session.add(salary_txn)

        # Also occasional freelance/dividend income
        if current_iter_date.month % 2 == 0:
            freelance_txn = Transaction(
                user_id=user.id,
                date=current_iter_date + timedelta(days=14),
                description="Consulting & UI Design Freelance Project",
                amount=18500.0,
                type="income",
                category="Income",
                payment_method="Bank Transfer",
                notes="Design project milestone payment",
                source="manual"
            )
            db.session.add(freelance_txn)

        # Monthly fixed rent
        rent_txn = Transaction(
            user_id=user.id,
            date=current_iter_date + timedelta(days=3),
            description="Apartment Monthly Rent Transfer",
            amount=24000.0,
            type="expense",
            category="Housing",
            payment_method="Bank Transfer",
            notes="Paid to landlord via NEFT",
            source="manual"
        )
        db.session.add(rent_txn)

        # Monthly investments
        sip_txn = Transaction(
            user_id=user.id,
            date=current_iter_date + timedelta(days=5),
            description="Zerodha Mutual Fund SIP Auto-Debit",
            amount=15000.0,
            type="expense",
            category="Investment",
            payment_method="Bank Transfer",
            notes="Index fund SIP",
            source="manual"
        )
        db.session.add(sip_txn)

        # Move to next month
        if current_iter_date.month == 12:
            current_iter_date = current_iter_date.replace(year=current_iter_date.year + 1, month=1)
        else:
            current_iter_date = current_iter_date.replace(month=current_iter_date.month + 1)

    # Generate realistic scattered expenses across all 180 days
    for day_offset in range(0, 180, 2):
        txn_date = start_date + timedelta(days=day_offset)
        if txn_date > today:
            break

        # Pick 1-3 random transactions for the day
        daily_txns = random.sample(SAMPLE_TRANSACTION_TEMPLATES, k=random.randint(1, 3))
        for desc, min_a, max_a, t_type, cat, pm in daily_txns:
            if cat in ["Housing", "Investment"]:  # Handled separately on monthly schedule
                continue
            amt = round(random.uniform(min_a, max_a), 2)
            txn = Transaction(
                user_id=user.id,
                date=txn_date,
                description=desc,
                amount=amt,
                type=t_type,
                category=cat,
                payment_method=pm,
                source="manual"
            )
            db.session.add(txn)

    # Seed Financial Goals
    goals_data = [
        ("Emergency Fund Reserve", 300000.0, 210000.0, today + timedelta(days=120), "Emergency Fund"),
        ("Apple MacBook Pro M3", 180000.0, 135000.0, today + timedelta(days=60), "Gadget"),
        ("Europe Summer Vacation", 250000.0, 85000.0, today + timedelta(days=240), "Vacation"),
        ("Royal Enfield Hunter 350", 190000.0, 190000.0, today - timedelta(days=15), "Vehicle"),
    ]

    for name, target, current, target_dt, cat in goals_data:
        goal = FinancialGoal(
            user_id=user.id,
            name=name,
            target_amount=target,
            current_amount=current,
            target_date=target_dt,
            category=cat
        )
        db.session.add(goal)

    db.session.commit()
    return user
