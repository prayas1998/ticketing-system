from uuid import UUID
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.ticket import TicketStatus, TicketPriority


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: TicketPriority = TicketPriority.MEDIUM
    assigned_to: Optional[UUID] = None


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[UUID] = None


class TicketResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    status: TicketStatus
    priority: TicketPriority
    assigned_to: Optional[UUID]
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
