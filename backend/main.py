from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import init_db, get_db, User, Policy
import routers.quotes as quotes

app = FastAPI(title="DC Broker API", description="Backend API per la ristrutturazione del sito DC Broker")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database on startup
@app.on_event("startup")
def on_startup():
    init_db()
    # Seed a dummy user and policies if empty
    db = next(get_db())
    try:
        if not db.query(User).first():
            user = User(email="azienda@demo.it")
            db.add(user)
            db.commit()
            db.refresh(user)
            
            p1 = Policy(title="Polizza CyberRisk PMI", premium=450.0, user_id=user.id, status="Attiva")
            p2 = Policy(title="Polizza D&O Amministratori", premium=800.0, user_id=user.id, status="Attiva")
            db.add(p1)
            db.add(p2)
            db.commit()
    finally:
        db.close()

# Include Routers
app.include_router(quotes.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Il server FastAPI è attivo e funzionante"}

# Mock policies endpoint for the dashboard
@app.get("/api/policies")
def get_user_policies(db: Session = Depends(get_db)):
    # Simple mock: return policies of the first user
    user = db.query(User).first()
    if not user:
        return []
    return db.query(Policy).filter(Policy.user_id == user.id).all()
