from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db, ContactRequest
from datetime import datetime

router = APIRouter(prefix="/api/contacts", tags=["contacts"])

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Nome del mittente")
    email: str = Field(..., description="Email del mittente")
    phone: str | None = Field(default=None, description="Telefono opzionale")
    subject: str = Field(..., min_length=3, description="Oggetto del messaggio")
    message: str = Field(..., min_length=10, description="Corpo del messaggio")

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    subject: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("", response_model=ContactResponse)
def create_contact_request(contact: ContactCreate, db: Session = Depends(get_db)):
    # Basic email validation check
    if "@" not in contact.email or "." not in contact.email:
        raise HTTPException(status_code=400, detail="Formato email non valido")

    db_request = ContactRequest(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        subject=contact.subject,
        message=contact.message
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request

@router.get("", response_model=list[ContactResponse])
def get_all_contacts(
    db: Session = Depends(get_db),
    x_admin_token: str | None = Header(default=None)
):
    if x_admin_token != "dcbroker-admin":
        raise HTTPException(status_code=401, detail="Non autorizzato")
    
    return db.query(ContactRequest).order_by(ContactRequest.created_at.desc()).all()
