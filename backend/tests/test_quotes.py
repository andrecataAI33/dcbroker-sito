import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent dir to path to import app and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import Base, engine

# Ensure clean db for tests
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_standard_quote():
    payload = {
        "company_name": "Test Company",
        "industry": "Servizi",
        "turnover": 450000.0,
        "has_mfa": False,
        "has_backup": False,
        "has_training": False,
        "limit_of_liability": 250000
    }
    response = client.post("/api/quotes/calculate", json=payload)
    assert response.status_code == 200
    res = response.json()
    # 450k turnover <= 500k -> 300 base
    # Servizi -> factor 1.0
    # 250k limit -> factor 1.0
    # No discounts -> 300.0 final
    assert res["calculated_premium"] == 300.0

def test_it_industry_factor():
    payload = {
        "company_name": "IT Corp",
        "industry": "IT e Software",
        "turnover": 450000.0,
        "has_mfa": False,
        "has_backup": False,
        "has_training": False,
        "limit_of_liability": 250000
    }
    response = client.post("/api/quotes/calculate", json=payload)
    assert response.status_code == 200
    res = response.json()
    # 300 base * 1.2 = 360.0
    assert res["calculated_premium"] == 360.0

def test_security_discounts():
    payload = {
        "company_name": "Secure Corp",
        "industry": "Servizi",
        "turnover": 450000.0,
        "has_mfa": True,       # 15% discount
        "has_backup": True,    # 15% discount
        "has_training": True,  # 10% discount -> Total 40% discount
        "limit_of_liability": 250000
    }
    response = client.post("/api/quotes/calculate", json=payload)
    assert response.status_code == 200
    res = response.json()
    # 300 base - (300 * 0.40) = 300 - 120 = 180.0
    assert res["calculated_premium"] == 180.0
