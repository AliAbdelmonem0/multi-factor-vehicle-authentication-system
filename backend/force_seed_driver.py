
import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure models are created
models.Base.metadata.create_all(bind=engine)

def seed_driver_6():
    db = SessionLocal()
    try:
        driver = db.query(models.Driver).filter(models.Driver.id == 6).first()
        if driver:
            print("⚠️ Driver ID 6 already exists!")
            print(f"   Name: {driver.name}")
            print(f"   Plate: {driver.car_plate}  <-- This might not match your image!")
            return

        print("Creating Driver ID 6...")
        
        # We need a user too? Typically yes for admin but for driver it's nice to have.
        # But for 'public/drivers/6', only Driver model matters.
        
        test_driver = models.Driver(
            id=6,  # Force ID 6
            name="Testing User",
            national_id="30000000000006",
            license_number="TEST-LIC-006",
            car_plate="سدو٩١٢٥", # Matching the Arabic plate chars from image
            photo_url="uploads/test_driver.jpg" # Dummy path
        )
        
        db.add(test_driver)
        db.commit()
        db.refresh(test_driver)
        
        print(f"✅ Driver Created! ID: {test_driver.id}, Name: {test_driver.name}")
        
    except Exception as e:
        print(f"❌ Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_driver_6()
