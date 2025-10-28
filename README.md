# Ticketing System

A simple ticketing system with three status states (Open, In Progress, Done). Built as a learning project to demonstrate modern web development practices with a clean architecture.

## Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- SQLite - Database
- Pydantic - Data validation
- Python-JOSE - JWT authentication
- Passlib - Password hashing

**Frontend:**
- React - UI library
- Vite - Build tool
- Tailwind CSS - Utility-first CSS framework

## Quick Start

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

**Quick commands:**

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Documentation

- [Setup Guide](docs/SETUP.md) - Installation and setup instructions
- [API Documentation](docs/API.md) - API endpoints and usage
- [Changelog](docs/CHANGELOG.md) - Project history and updates

## Development Phases

- ✅ Phase 0: Project skeleton
- ⬜ Phase 1: Database models & schemas
- ⬜ Phase 2: Read-only API endpoints
- ⬜ Phase 3: Write API endpoints
- ⬜ Phase 4: Authentication layer
- ⬜ Phase 5: Basic frontend (read-only)
- ⬜ Phase 6: Interactive frontend
