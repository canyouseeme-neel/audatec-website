from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactLead(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    lead_id: str = Field(default_factory=lambda: f"lead-{uuid4().hex[:12]}")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)
    company: str | None = Field(default=None, max_length=120)
    message: str = Field(min_length=10, max_length=4000)
    source: Literal["website-contact", "demo-contact", "api"] = "website-contact"
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = "".join(ch for ch in value if ch.isdigit() or ch in {"+", "-", " "})
        return cleaned.strip() or None
