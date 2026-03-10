from typing import Any

from app.integrations.supabase_client import get_supabase_client
from app.models.contact import ContactLead


class ContactRepository:
    """Repository with Supabase-first write and in-memory fallback."""

    def __init__(self):
        self._memory_store: dict[str, ContactLead] = {}

    def save(self, lead: ContactLead) -> ContactLead:
        supabase = get_supabase_client()
        if supabase is not None:
            payload = lead.model_dump()
            response = supabase.table("contact_leads").insert(payload).execute()
            # Supabase response data can be empty based on return settings.
            if getattr(response, "data", None):
                returned = response.data[0]
                return ContactLead.model_validate(returned)

        self._memory_store[lead.lead_id] = lead
        return lead

    def get(self, lead_id: str) -> ContactLead | None:
        supabase = get_supabase_client()
        if supabase is not None:
            response = (
                supabase.table("contact_leads")
                .select("*")
                .eq("lead_id", lead_id)
                .limit(1)
                .execute()
            )
            data: list[dict[str, Any]] = getattr(response, "data", [])
            if data:
                return ContactLead.model_validate(data[0])
        return self._memory_store.get(lead_id)
