# Smart AI-Based Personal Finance Advisor

A production-grade, modular, responsive full-stack personal finance and wealth intelligence web application. Built with **React.js, Vite, Tailwind CSS** on the frontend and **Python, Flask, SQLAlchemy, Pandas** on the backend.

---

## 🌐 Live Deployed Application

- **Live Web Application:** [https://fintech-beta-eight.vercel.app](https://fintech-beta-eight.vercel.app)
- **Direct Login:** [https://fintech-beta-eight.vercel.app/login](https://fintech-beta-eight.vercel.app/login)
- **Live API Base URL:** [https://fintech-beta-eight.vercel.app/api](https://fintech-beta-eight.vercel.app/api)

### 🔑 Instant Demo Credentials
Click the **"1-Click Demo"** button on the Login page or use:
- **Email:** `demo@smartfinance.com`
- **Password:** `demo12345`

---

## 🌟 Key Features

1. **Dashboard & Key Financial Metrics**
   - Live calculated Total Balance, Monthly Income, Monthly Expenses, Monthly Savings, Savings Rate %, and Financial Health Score.
   - Dynamic interactive charts (Category Donut, Monthly Cash Flow Bar Chart, Spending Trend Area Chart).
   - Recent transaction audit trail.

2. **Bank Statement CSV Ingestion Engine**
   - Drag-and-drop CSV upload with Pandas parsing pipeline.
   - Flexible column header detection (`Date`, `Description/Narration`, `Debit`, `Credit`, `Balance`).
   - Duplicate transaction detection and automatic categorization preview.
   - Ingestion summary metrics with upload history logging.

3. **Intelligent Auto-Categorization**
   - Configurable keyword engine mapping merchants (Swiggy/Zomato -> Food, Uber/Ola -> Travel, Amazon/Flipkart -> Shopping, Netflix/Spotify -> Entertainment, Electricity/Rent -> Bills/Housing, Salary -> Income, etc.).
   - Support for manual category adjustments during statement preview.

4. **Financial Health Score (0–100)**
   - Algorithmic score evaluating 5 sub-factors: Savings Rate (20pts), Expense Control (20pts), Cash Flow Consistency (20pts), Spending Variance (20pts), and Essential vs Discretionary Ratio (20pts).
   - Tiers: *Excellent* (80–100), *Healthy* (60–79), *Needs Attention* (40–59), *Critical* (0–39).

5. **AI Financial Advisor**
   - Heuristic recommendation engine analyzing actual financial data.
   - Categorized insight badges: *Critical Alert*, *Overspending Warning*, *Savings Recommendation*, *Spending Pattern*, and *Positive Habit*.
   - Interactive "What-If" Wealth Simulator to model lifestyle expense cuts into compounding savings.

6. **Full Transaction Management**
   - Add, edit, delete, search, multi-filter (Type, Category, Payment Method, Date Range), sort, paginate, and export to CSV.

7. **Financial Goals Tracker**
   - Visual progress bars, target vs current amounts, target deadlines, and recommended monthly savings needed to reach goals.

8. **Monthly & Annual Financial Reports**
   - Detailed statements with category breakdowns, health scores, top outflows, and printable / PDF export mode.

9. **Security & Authentication**
   - JWT token authentication, bcrypt password hashing, user data isolation, and input validations.

---

## 🚀 Technology Stack

### Frontend
- **React.js (v18)** + **Vite**
- **Tailwind CSS** (Custom dark fintech aesthetic with glassmorphism)
- **Lucide React** (Modern iconography)
- **Recharts** (Interactive charting)
- **Axios** (Centralized API client with JWT interceptor)
- **React Router Dom (v6)**

### Backend
- **Python 3.10+ / 3.13**
- **Flask** & **Flask-SQLAlchemy** (ORM)
- **Flask-JWT-Extended** (Token authentication)
- **Flask-CORS**
- **Pandas** (High-performance CSV bank statement processing)
- **SQLite** (Development database with PostgreSQL/MySQL migration readiness)

---

## 📁 Project Structure

```text
fintech/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory, CORS, JWT, DB
│   │   ├── models/               # SQLAlchemy models (User, Transaction, Goal, Category, Statement)
│   │   ├── routes/               # Blueprint routes (auth, dashboard, transactions, csv, analytics, advisor, goals, reports, user)
│   │   ├── services/             # Core business logic (categorizer, csv_parser, health_score, advisor, analytics, seed)
│   │   └── utils/                # Standardized response and validation helpers
│   ├── sample_data/              # Sample HDFC and SBI statement CSVs for testing
│   ├── uploads/                  # Temporary uploaded statements folder
│   ├── config.py                 # App configuration
│   ├── requirements.txt          # Python dependencies
│   ├── run.py                    # Server entrypoint
│   ├── seed.py                   # Demo database seeder
│   └── test_api.py               # API verification test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components (Sidebar, Navbar, StatCard, Charts, Modals, Badges)
│   │   ├── context/              # AuthContext & ToastContext
│   │   ├── pages/                # 12 complete pages
│   │   ├── services/             # Centralized Axios API service layer
│   │   ├── utils/                # Currency (INR ₹) & date formatters
│   │   ├── App.jsx               # Router & Protected route setup
│   │   ├── main.jsx              # React DOM entrypoint
│   │   └── index.css             # Tailwind CSS & glassmorphism styles
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── tailwind.config.js
│
├── render.yaml
├── README.md
└── .gitignore
```

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Seed demo user data (6 months of realistic transactions):
   ```bash
   python seed.py
   ```
4. Start the Flask server:
   ```bash
   python run.py
   ```
   *The backend will run on `http://127.0.0.1:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---

## 🔑 Demo Account Credentials

Click the **"1-Click Demo"** button on the Login page or use:
- **Email:** `demo@smartfinance.com`
- **Password:** `demo12345`

---

## 📄 Sample CSV Statements for Upload Testing

You can use the provided sample statement CSV files in `backend/sample_data/`:
- `backend/sample_data/hdfc_bank_statement.csv`
- `backend/sample_data/sbi_bank_statement.csv`

Or download them directly from the **CSV Statement** page inside the web application.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Log in and receive JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/dashboard` | Aggregated dashboard metrics & charts |
| `GET` | `/api/transactions` | Query transactions with search, filter, pagination |
| `POST` | `/api/transactions` | Create new transaction |
| `PUT` | `/api/transactions/<id>` | Update existing transaction |
| `DELETE` | `/api/transactions/<id>` | Delete transaction |
| `POST` | `/api/csv/upload` | Upload & preview bank statement CSV |
| `POST` | `/api/csv/import` | Commit staged CSV rows to database |
| `GET` | `/api/csv/history` | Statement upload history log |
| `GET` | `/api/analytics` | Deep-dive analytics by date horizon |
| `GET` | `/api/advisor/recommendations` | Rule-based AI wealth recommendations |
| `GET` | `/api/health-score` | Multi-factor Financial Health Score |
| `GET` | `/api/goals` | List financial goals & progress |
| `POST` | `/api/goals` | Create financial goal |
| `GET` | `/api/reports/monthly` | Generate monthly statement report |
| `GET` | `/api/reports/yearly` | Generate yearly statement dossier |