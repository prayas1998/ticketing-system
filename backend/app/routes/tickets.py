from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db, get_current_user
from app.models import Ticket, User
from app.schemas import TicketResponse, TicketCreate, TicketUpdate
from app.schemas.ticket import UserBasic

router = APIRouter(prefix="/tickets", tags=["tickets"])


def ticket_to_response(ticket: Ticket) -> dict:
    """Convert Ticket model to TicketResponse dict with user data."""
    return {
        "id": ticket.id,
        "title": ticket.title,
        "description": ticket.description,
        "status": ticket.status,
        "priority": ticket.priority,
        "assigned_to_user": UserBasic.model_validate(ticket.assignee) if ticket.assignee else None,
        "created_by_user": UserBasic.model_validate(ticket.creator),
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
    }


@router.get("/", response_model=dict)
def get_all_tickets(db: Session = Depends(get_db)) -> dict:
    """Get all tickets."""
    try:
        tickets = db.query(Ticket).options(
            joinedload(Ticket.assignee),
            joinedload(Ticket.creator)
        ).all()
        return {"data": [ticket_to_response(ticket) for ticket in tickets]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{ticket_id}", response_model=dict)
def get_ticket_by_id(ticket_id: UUID, db: Session = Depends(get_db)) -> dict:
    """Get single ticket by ID."""
    try:
        ticket = db.query(Ticket).options(
            joinedload(Ticket.assignee),
            joinedload(Ticket.creator)
        ).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return {"data": ticket_to_response(ticket)}
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
        
        ticket = db.query(Ticket).options(
            joinedload(Ticket.assignee),
            joinedload(Ticket.creator)
        ).filter(Ticket.id == new_ticket.id).first()
        
        return {"data": ticket_to_response(ticket)}
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
        
        updated_ticket = db.query(Ticket).options(
            joinedload(Ticket.assignee),
            joinedload(Ticket.creator)
        ).filter(Ticket.id == ticket_id).first()
        
        return {"data": ticket_to_response(updated_ticket)}
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
