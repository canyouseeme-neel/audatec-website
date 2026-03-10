from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)
    company: str | None = Field(default=None, max_length=120)
    message: str = Field(min_length=10, max_length=4000)
    source: str = "website-contact"

    @field_validator("phone", "company", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str | None) -> str | None:
        if v is None:
            return None
        if isinstance(v, str) and not v.strip():
            return None
        return v


class ContactResponse(BaseModel):
    lead_id: str
    name: str
    email: EmailStr
    phone: str | None
    company: str | None
    message: str
    source: str
    created_at: str
