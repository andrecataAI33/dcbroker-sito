import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent dir to path to import app and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import Base, engine, ContactRequest

client = TestClient(app)

def test_create_contact_request():
    payload = {
        "name": "Mario Rossi",
        "email": "mario.rossi@example.com",
        "phone": "3331234567",
        "subject": "Preventivo Incendio",
        "message": "Vorrei richiedere maggiori informazioni in merito alla polizza incendio per capannone."
    }
    response = client.post("/api/contacts", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["name"] == "Mario Rossi"
    assert res["email"] == "mario.rossi@example.com"
    assert res["subject"] == "Preventivo Incendio"

def test_invalid_email_contact_request():
    payload = {
        "name": "Mario Rossi",
        "email": "invalid_email_format",
        "phone": "3331234567",
        "subject": "Preventivo Incendio",
        "message": "Vorrei richiedere maggiori informazioni in merito alla polizza incendio per capannone."
    }
    response = client.post("/api/contacts", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Formato email non valido"
