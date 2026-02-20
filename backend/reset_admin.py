from database import SessionLocal
from models import User
from auth import get_password_hash

def reset_admin():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "admin").first()
        if user:
            print(f"Found admin user. Resetting password...")
            user.hashed_password = get_password_hash("admin123")
            db.commit()
            print("✅ Password reset to 'admin123'")
        else:
            print("❌ Admin user not found! Creating one...")
            admin = User(username="admin", hashed_password=get_password_hash("admin123"), role="admin")
            db.add(admin)
            db.commit()
            print("✅ Admin user created with password 'admin123'")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
