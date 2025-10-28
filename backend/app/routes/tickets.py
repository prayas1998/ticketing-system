from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Ticket
from app.schemas import TicketResponse

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=dict)
def get_all_tickets(db: Session = Depends(get_db)) -> dict:
    """Get all tickets."""
    try:
        tickets = db.query(Ticket).all()
        return {"data": [TicketResponse.model_validate(ticket) for ticket in tickets]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{ticket_id}", response_model=dict)
def get_ticket_by_id(ticket_id: UUID, db: Session = Depends(get_db)) -> dict:
    """Get single ticket by ID."""
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return {"data": TicketResponse.model_validate(ticket)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
