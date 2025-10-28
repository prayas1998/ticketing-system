from app.database import SessionLocal
from app.models import User, Ticket

from seed_db import seed_database


def test_database() -> None:
    """Test the database models by querying seeded data."""
    seed_database()
    
    db = SessionLocal()
    try:
        print("\n" + "="*60)
        print("DATABASE TEST - Querying All Data")
        print("="*60)
        
        users = db.query(User).all()
        print(f"\n📋 USERS ({len(users)} total):")
        print("-" * 60)
        for user in users:
            print(f"  ID: {user.id}")
            print(f"  Username: {user.username}")
            print(f"  Email: {user.email}")
            print(f"  Created: {user.created_at}")
            print(f"  Updated: {user.updated_at}")
            print()
        
        tickets = db.query(Ticket).all()
        print(f"\n🎫 TICKETS ({len(tickets)} total):")
        print("-" * 60)
        for ticket in tickets:
            creator = db.query(User).filter(User.id == ticket.created_by).first()
            assignee = db.query(User).filter(User.id == ticket.assigned_to).first() if ticket.assigned_to else None
            
            print(f"  ID: {ticket.id}")
            print(f"  Title: {ticket.title}")
            print(f"  Description: {ticket.description or '(none)'}")
            print(f"  Status: {ticket.status.value}")
            print(f"  Priority: {ticket.priority.value}")
            print(f"  Created by: {creator.username if creator else 'Unknown'}")
            print(f"  Assigned to: {assignee.username if assignee else 'Unassigned'}")
            print(f"  Created: {ticket.created_at}")
            print(f"  Updated: {ticket.updated_at}")
            print()
        
        print("="*60)
        print("✅ Database test completed successfully!")
        print("="*60 + "\n")
        
    finally:
        db.close()


if __name__ == "__main__":
    test_database()
