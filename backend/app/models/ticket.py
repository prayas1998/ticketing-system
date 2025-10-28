from uuid import uuid4
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class TicketStatus(PyEnum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TicketPriority(PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN, nullable=False)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tickets")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_tickets")
