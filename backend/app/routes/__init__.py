from app.routes.tickets import router as tickets_router
from app.routes.users import router as users_router
from app.routes.auth import router as auth_router

__all__ = ["tickets_router", "users_router", "auth_router"]

