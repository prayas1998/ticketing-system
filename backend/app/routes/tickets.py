from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models import Ticket, User
from app.schemas import TicketResponse, TicketCreate, TicketUpdate

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("/", response_model=dict)
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


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_data: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """Create a new ticket."""
    try:
        new_ticket = Ticket(
            title=ticket_data.title,
            description=ticket_data.description,
            priority=ticket_data.priority,
            assigned_to=ticket_data.assigned_to,
            created_by=current_user.id
        )
        
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        
        return {"data": TicketResponse.model_validate(new_ticket)}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/{ticket_id}", response_model=dict)
def update_ticket(
    ticket_id: UUID,
    ticket_data: TicketUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """Update an existing ticket."""
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        update_data = ticket_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
        
        db.commit()
        db.refresh(ticket)
        
        return {"data": TicketResponse.model_validate(ticket)}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{ticket_id}", response_model=dict)
def delete_ticket(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """Delete a ticket."""
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        db.delete(ticket)
        db.commit()
        
        return {"data": {"message": "Ticket deleted successfully"}}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
