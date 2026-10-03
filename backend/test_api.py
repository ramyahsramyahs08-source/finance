import json
from app import create_app

app = create_app()
client = app.test_client()

def test_api():
    print("--- 1. Testing Auth Login ---")
    login_res = client.post('/api/auth/login', json={
        "email": "demo@smartfinance.com",
        "password": "demo12345"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.data}"
    token = login_res.json['data']['token']
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Auth login passed. Token received.")

    print("--- 2. Testing Dashboard ---")
    dash_res = client.get('/api/dashboard', headers=headers)
    assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.data}"
    d_data = dash_res.json['data']
    print(f"[OK] Dashboard Metrics: Balance={d_data['metrics']['total_balance']}, Health Score={d_data['metrics']['health_score']}")

    print("--- 3. Testing Transactions GET and POST ---")
    txns_res = client.get('/api/transactions', headers=headers)
    assert txns_res.status_code == 200
    print(f"[OK] Transactions count={txns_res.json['data']['pagination']['total']}")

    post_txn = client.post('/api/transactions', headers=headers, json={
        "date": "2026-08-25",
        "description": "Zomato Gourmet Dinner",
        "amount": 840.0,
        "type": "expense",
        "category": "Food",
        "payment_method": "UPI"
    })
    assert post_txn.status_code == 201
    new_id = post_txn.json['data']['id']
    print(f"[OK] Transaction created with ID {new_id}")

    print("--- 4. Testing Analytics ---")
    analytics_res = client.get('/api/analytics?filter=6_months', headers=headers)
    assert analytics_res.status_code == 200
    print(f"[OK] Analytics fetched: categories count={len(analytics_res.json['data']['category_breakdown'])}")

    print("--- 5. Testing Advisor Recommendations ---")
    rec_res = client.get('/api/advisor/recommendations', headers=headers)
    assert rec_res.status_code == 200
    print(f"[OK] AI recommendations count={len(rec_res.json['data'])}")

    print("--- 6. Testing Health Score API ---")
    hs_res = client.get('/api/health-score', headers=headers)
    assert hs_res.status_code == 200
    print(f"[OK] Health Score={hs_res.json['data']['score']}, Status={hs_res.json['data']['status']}")

    print("--- 7. Testing Goals ---")
    goals_res = client.get('/api/goals', headers=headers)
    assert goals_res.status_code == 200
    print(f"[OK] Goals count={len(goals_res.json['data']['goals'])}")

    print("--- 8. Testing Reports ---")
    monthly_rep = client.get('/api/reports/monthly?year=2026&month=8', headers=headers)
    assert monthly_rep.status_code == 200
    print(f"[OK] Monthly Report generated for period={monthly_rep.json['data']['period']}")

    print("=== ALL BACKEND ENDPOINTS PASSED SUCCESSFULLY! ===")

if __name__ == '__main__':
    test_api()
