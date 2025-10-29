from uuid import UUID
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from pydantic import BaseModel, Field

from app.models.ticket import TicketStatus, TicketPriority

if TYPE_CHECKING:
    from app.schemas.user import UserBase


class UserBasic(BaseModel):
    id: UUID
    username: str

    class Config:
        from_attributes = True


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
    assigned_to_user: Optional[UserBasic] = None
    created_by_user: UserBasic
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
