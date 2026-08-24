import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./dcbroker.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    policies = relationship("Policy", back_populates="owner")

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    status = Column(String, default="Attiva")  # e.g., Attiva, Scaduta, Sospesa
    premium = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner = relationship("User", back_populates="policies")

class QuoteRequest(Base):
    __tablename__ = "quote_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=True)
    industry = Column(String, nullable=False)  # e.g., IT, Servizi, Commercio, Manifatturiero, Sanità
    turnover = Column(Float, nullable=False)
    has_mfa = Column(Boolean, default=False)
    has_backup = Column(Boolean, default=False)
    has_training = Column(Boolean, default=False)
    calculated_premium = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ContactRequest(Base):
    __tablename__ = "contact_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
      yield db
    finally:
      db.close()
