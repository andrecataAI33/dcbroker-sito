from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db, QuoteRequest

router = APIRouter(prefix="/api/quotes", tags=["quotes"])

class QuoteCreate(BaseModel):
    company_name: str | None = Field(default=None, description="Nome dell'azienda")
    industry: str = Field(..., description="Settore merceologico (IT, Servizi, Commercio, Manifatturiero, Sanita)")
    turnover: float = Field(..., gt=0, description="Fatturato annuo in euro")
    has_mfa: bool = Field(default=False, description="Uso autenticazione multi-fattore")
    has_backup: bool = Field(default=False, description="Backup sicuri attivi")
    has_training: bool = Field(default=False, description="Formazione dipendenti phishing")
    limit_of_liability: int = Field(default=250000, description="Massimale di copertura (250000, 500000, 1000000)")

class QuoteResponse(BaseModel):
    id: int
    company_name: str | None
    calculated_premium: float
    base_premium: float
    discounts_applied: float
    final_premium: float

@router.post("/calculate", response_model=QuoteResponse)
def calculate_quote(quote: QuoteCreate, db: Session = Depends(get_db)):
    # 1. Base premium by turnover
    if quote.turnover <= 500000:
        base = 300.0
    elif quote.turnover <= 2500000:
        base = 600.0
    elif quote.turnover <= 10000000:
        base = 1200.0
    else:
        base = 2500.0
        
    # 2. Industry risk factor
    industry_clean = quote.industry.lower().strip()
    if "it" in industry_clean or "sanita" in industry_clean or "sanità" in industry_clean:
        base = base * 1.2
    elif "manifatturiero" in industry_clean:
        base = base * 1.1
    # other sectors have factor 1.0
    
    # 3. Limit of liability factor
    if quote.limit_of_liability == 500000:
        base = base * 1.25
    elif quote.limit_of_liability >= 1000000:
        base = base * 1.60
    elif quote.limit_of_liability != 250000:
        raise HTTPException(status_code=400, detail="Massimale non valido. Scegli tra 250000, 500000 o 1000000")
        
    # 4. Apply discounts
    total_discount_pct = 0.0
    if quote.has_mfa:
        total_discount_pct += 0.15
    if quote.has_backup:
        total_discount_pct += 0.15
    if quote.has_training:
        total_discount_pct += 0.10
        
    discounts_val = base * total_discount_pct
    final_premium = round(base - discounts_val, 2)
    
    # 5. Save to database
    db_request = QuoteRequest(
        company_name=quote.company_name,
        industry=quote.industry,
        turnover=quote.turnover,
        has_mfa=quote.has_mfa,
        has_backup=quote.has_backup,
        has_training=quote.has_training,
        calculated_premium=final_premium
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return QuoteResponse(
        id=db_request.id,
        company_name=db_request.company_name,
        calculated_premium=final_premium,
        base_premium=round(base, 2),
        discounts_applied=round(discounts_val, 2),
        final_premium=final_premium
    )
