from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.orm import Session
from database import get_db, ContactRequest

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
    subject: str
    message: str

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
