import bcrypt

from app.database import SessionLocal, create_tables
from app.models import User, Ticket, TicketStatus, TicketPriority


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def seed_database() -> None:
    """Seed the database with test data."""
    create_tables()
    
    db = SessionLocal()
    try:
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already seeded. Skipping...")
            return
        
        user1 = User(
            username="alice",
            email="alice@example.com",
            hashed_password=hash_password("password123")
        )
        user2 = User(
            username="bob",
            email="bob@example.com",
            hashed_password=hash_password("password123")
        )
        
        db.add(user1)
        db.add(user2)
        db.commit()
        db.refresh(user1)
        db.refresh(user2)
        
        tickets = [
            Ticket(
                title="Fix login bug",
                description="Users cannot log in with correct credentials",
                status=TicketStatus.OPEN,
                priority=TicketPriority.HIGH,
                created_by=user1.id,
                assigned_to=user2.id
            ),
            Ticket(
                title="Add dark mode",
                description="Implement dark mode theme for the application",
                status=TicketStatus.IN_PROGRESS,
                priority=TicketPriority.MEDIUM,
                created_by=user1.id,
                assigned_to=user2.id
            ),
            Ticket(
                title="Update documentation",
                description="Update API documentation with new endpoints",
                status=TicketStatus.DONE,
                priority=TicketPriority.LOW,
                created_by=user2.id,
                assigned_to=user1.id
            ),
            Ticket(
                title="Optimize database queries",
                description="Improve query performance for large datasets",
                status=TicketStatus.OPEN,
                priority=TicketPriority.MEDIUM,
                created_by=user2.id,
                assigned_to=None
            ),
            Ticket(
                title="Add user profile page",
                description=None,
                status=TicketStatus.OPEN,
                priority=TicketPriority.LOW,
                created_by=user1.id,
                assigned_to=user2.id
            ),
        ]
        
        for ticket in tickets:
            db.add(ticket)
        
        db.commit()
        print(f"Database seeded successfully!")
        print(f"Created {len([user1, user2])} users and {len(tickets)} tickets.")
        
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
