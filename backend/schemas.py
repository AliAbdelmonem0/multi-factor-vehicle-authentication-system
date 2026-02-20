from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Car Schemas
class CarBase(BaseModel):
    plate_number: str
    model: str
    color: str

class CarCreate(CarBase):
    pass

class Car(CarBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Stolen Car Schemas
class StolenCarBase(BaseModel):
    plate_number: str
    description: str

class StolenCarCreate(StolenCarBase):
    pass

class StolenCar(StolenCarBase):
    id: int
    status: str
    last_seen_location: Optional[str] = None
    created_at: datetime
    reporter_id: int

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str

class UserLogIn(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    driver_id: Optional[int] = None
    reported_stolen_cars: List[StolenCar] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

# Driver Schemas
class DriverBase(BaseModel):
    name: str
    national_id: str
    license_number: str
    photo_url: Optional[str] = None

class DriverCreate(DriverBase):
    cars: List[CarCreate] = []

class Driver(DriverBase):
    id: int
    cars: List[Car] = []

    class Config:
        from_attributes = True
