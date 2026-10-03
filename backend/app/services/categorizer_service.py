import re
from app.models import Category

DEFAULT_CATEGORY_KEYWORDS = {
    "Food": [
        "swiggy", "zomato", "mcdonald", "kfc", "domino", "pizza", "starbucks", 
        "burger", "restaurant", "cafe", "dine", "eat", "blinkit", "zepto", "instamart",
        "grocery", "supermarket", "bakery", "chai", "coffee", "haldiram", "subway"
    ],
    "Travel": [
        "uber", "ola", "rapido", "irctc", "makemytrip", "goibibo", "flight", 
        "indigo", "air india", "vistara", "fuel", "petrol", "hpcl", "bpcl", "iocl",
        "metro", "toll", "fastag", "parking", "train", "bus", "redbus", "cab"
    ],
    "Shopping": [
        "amazon", "flipkart", "myntra", "ajio", "zara", "h&m", "nykaa", "meesho",
        "tata cliq", "croma", "reliance digital", "decathlon", "uniqlo", "retail",
        "store", "mall", "clothing", "apparel", "footwear", "electronics"
    ],
    "Bills": [
        "electricity", "bescom", "tneb", "wbsebl", "water", "gas", "indane", "hp gas",
        "broadband", "airtel", "jio", "vi", "vodafone", "recharge", "wifi", "act fibernet",
        "dth", "tata play", "utility", "postpaid", "bill payment", "maintenance"
    ],
    "Housing": [
        "rent", "nobroker", "housing", "landlord", "society", "maintenance", 
        "home loan", "emi house", "property tax", "furniture", "ikea"
    ],
    "Entertainment": [
        "netflix", "spotify", "prime video", "disney", "hotstar", "youtube", "bookmyshow",
        "pvr", "inox", "cinema", "theatre", "movie", "steam", "playstation", "apple music",
        "gaming", "concert", "club"
    ],
    "Health": [
        "medical", "pharmacy", "hospital", "apollo", "medplus", "1mg", "pharmeasy", "doctor",
        "clinic", "dental", "pathology", "lab", "diagnostic", "medicine", "health insurance",
        "gym", "cult.fit", "fitness"
    ],
    "Education": [
        "udemy", "coursera", "school", "college", "tuition", "course", "books",
        "stationery", "exam", "university", "academy", "training", "fees"
    ],
    "Investment": [
        "zerodha", "groww", "upstox", "mutual fund", "sip", "coin", "kuvera", 
        "fixed deposit", "recurring deposit", "gold", "stocks", "ppf", "nps"
    ],
    "Income": [
        "salary", "payroll", "dividend", "interest credited", "cashback", "refund", 
        "freelance", "bonus", "incentive", "stipend", "credit interest", "deposit"
    ],
    "Others": [
        "atm", "withdrawal", "cash withdrawal", "transfer", "self transfer"
    ]
}

def categorize_transaction(description: str, txn_type: str = "expense") -> str:
    if not description:
        return "Income" if txn_type == "income" else "Others"
    
    desc_clean = description.lower()

    # If explicitly income type and matches income terms
    if txn_type == "income":
        for kw in DEFAULT_CATEGORY_KEYWORDS.get("Income", []):
            if kw in desc_clean:
                return "Income"
        return "Income"

    # Check database categories if available
    try:
        db_categories = Category.query.all()
        for cat in db_categories:
            if cat.keywords:
                for kw in cat.keywords.split(","):
                    kw_clean = kw.strip().lower()
                    if kw_clean and (kw_clean in desc_clean or re.search(rf"\b{re.escape(kw_clean)}\b", desc_clean)):
                        return cat.name
    except Exception:
        pass

    # Fallback to default in-memory rules
    for category, keywords in DEFAULT_CATEGORY_KEYWORDS.items():
        if category == "Income" and txn_type != "income":
            continue
        for kw in keywords:
            if kw in desc_clean or re.search(rf"\b{re.escape(kw)}\b", desc_clean):
                return category

    return "Others"

def get_default_categories():
    return [
        {"name": "Food", "type": "expense", "icon": "Utensils", "color": "#F97316", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Food"]), "is_essential": True},
        {"name": "Travel", "type": "expense", "icon": "Car", "color": "#06B6D4", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Travel"]), "is_essential": True},
        {"name": "Shopping", "type": "expense", "icon": "ShoppingBag", "color": "#EC4899", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Shopping"]), "is_essential": False},
        {"name": "Bills", "type": "expense", "icon": "Receipt", "color": "#EAB308", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Bills"]), "is_essential": True},
        {"name": "Housing", "type": "expense", "icon": "Home", "color": "#8B5CF6", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Housing"]), "is_essential": True},
        {"name": "Entertainment", "type": "expense", "icon": "Film", "color": "#A855F7", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Entertainment"]), "is_essential": False},
        {"name": "Health", "type": "expense", "icon": "HeartPulse", "color": "#EF4444", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Health"]), "is_essential": True},
        {"name": "Education", "type": "expense", "icon": "GraduationCap", "color": "#3B82F6", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Education"]), "is_essential": True},
        {"name": "Investment", "type": "expense", "icon": "TrendingUp", "color": "#10B981", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Investment"]), "is_essential": False},
        {"name": "Others", "type": "expense", "icon": "MoreHorizontal", "color": "#64748B", "keywords": "", "is_essential": False},
        {"name": "Income", "type": "income", "icon": "Wallet", "color": "#10B981", "keywords": ",".join(DEFAULT_CATEGORY_KEYWORDS["Income"]), "is_essential": False},
    ]
