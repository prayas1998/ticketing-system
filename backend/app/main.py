from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import tickets_router, users_router, auth_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(title="Ticketing System API")

origins = (
    ["http://localhost:5173"]
    if settings.environment == "development"
    else []
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(tickets_router, prefix="/api")
app.include_router(users_router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
