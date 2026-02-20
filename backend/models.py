from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
try:
    from .database import Base
except ImportError:
    from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'admin' or 'driver'
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)

    driver = relationship("Driver", back_populates="user")
    reported_stolen_cars = relationship("StolenCar", back_populates="reporter")

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    national_id = Column(String, unique=True, index=True)
    license_number = Column(String, unique=True, index=True)
    photo_url = Column(String, nullable=True)

    cars = relationship("Car", back_populates="owner")
    user = relationship("User", back_populates="driver", uselist=False)

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, unique=True, index=True)
    model = Column(String)
    color = Column(String)
    owner_id = Column(Integer, ForeignKey("drivers.id"))

    owner = relationship("Driver", back_populates="cars")

class StolenCar(Base):
    __tablename__ = "stolen_cars"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="reported") # 'reported', 'found'
    last_seen_location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reporter_id = Column(Integer, ForeignKey("users.id"))

    reporter = relationship("User", back_populates="reported_stolen_cars")
