from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> dict:
    """Register a new user and return access token."""
    try:
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(user_data.password)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = create_access_token({
            "user_id": str(new_user.id),
            "username": new_user.username
        })
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/login", response_model=dict)
def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
) -> dict:
    """Login user and return access token."""
    try:
        user = db.query(User).filter(User.username == username).first()
        
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        access_token = create_access_token({
            "user_id": str(user.id),
            "username": user.username
        })
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)) -> dict:
    """Get current authenticated user information."""
    return {"data": UserResponse.model_validate(current_user)}
