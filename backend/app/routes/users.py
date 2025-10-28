from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import User
from app.schemas import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=dict)
def get_all_users(db: Session = Depends(get_db)) -> dict:
    """Get all users."""
    try:
        users = db.query(User).all()
        return {"data": [UserResponse.model_validate(user) for user in users]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{user_id}", response_model=dict)
def get_user_by_id(user_id: UUID, db: Session = Depends(get_db)) -> dict:
    """Get single user by ID."""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"data": UserResponse.model_validate(user)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
