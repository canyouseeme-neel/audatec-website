from fastapi import APIRouter, HTTPException, status

from app.models.contact import ContactLead
from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/contacts", tags=["contacts"])
repository = ContactRepository()

@router.post("", response_model=ContactResponse)
async def create_contact(payload: ContactCreate) -> ContactResponse:
    lead = ContactLead(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        company=payload.company,
        message=payload.message,
        source=payload.source if payload.source in {"website-contact", "demo-contact", "api"} else "api",
    )
    saved = repository.save(lead)
    return ContactResponse(**saved.model_dump())


@router.get("/{lead_id}", response_model=ContactResponse)
async def get_contact(lead_id: str) -> ContactResponse:
    lead = repository.get(lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead {lead_id} not found",
        )
    return ContactResponse(**lead.model_dump())
