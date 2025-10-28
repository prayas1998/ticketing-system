from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import tickets_router, users_router, auth_router

app = FastAPI(title="Ticketing System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(tickets_router, prefix="/api")
app.include_router(users_router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
