from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
try:
    from . import models, schemas, database, auth
except ImportError:
    import models, schemas, database, auth
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
import uuid
# Define UPLOADS_DIR relative to this file (backend/main.py) -> goes to project root/uploads
from fastapi.staticfiles import StaticFiles
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(os.path.dirname(BASE_DIR), "uploads")
STATIC_URL = "/uploads"

app = FastAPI()

app.mount(STATIC_URL, StaticFiles(directory=UPLOADS_DIR), name="uploads")

models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Helpers
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except auth.JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    # Create Default Admin if it doesn't exist
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin:
        hashed_password = auth.get_password_hash("admin123")
        db_admin = models.User(username="admin", hashed_password=hashed_password, role="admin")
        db.add(db_admin)
        db.commit()
    db.close()

@app.post("/token", response_model=schemas.Token)
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"Login attempt: username={form_data.username}")
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user:
        print("User not found")
    elif not auth.verify_password(form_data.password, user.hashed_password):
        print(f"Password mismatch for {form_data.username}")
        # print(f"Input: {form_data.password}, Hash: {user.hashed_password}") # SECURITY RISK, but useful for debugging if desperate
    else:
        print("Login successful")

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

@app.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/my-driver-profile", response_model=schemas.Driver)
def get_my_driver_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "driver" or not current_user.driver_id:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    driver = db.query(models.Driver).filter(models.Driver.id == current_user.driver_id).first()
    return driver

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    # Defaulting to 'user' role if not specified or force it. Schema has role.
    new_user = models.User(username=user.username, hashed_password=hashed_password, role=user.role) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/stolen-cars/", response_model=schemas.StolenCar)
def report_stolen_car(car: schemas.StolenCarCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_report = models.StolenCar(**car.dict(), reporter_id=current_user.id)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@app.get("/stolen-cars/", response_model=List[schemas.StolenCar])
def read_stolen_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.StolenCar).offset(skip).limit(limit).all()

@app.post("/report-sighting/")
def report_sighting(plate_number: str, location: str, db: Session = Depends(get_db)):
    stolen_car = db.query(models.StolenCar).filter(models.StolenCar.plate_number == plate_number, models.StolenCar.status == "reported").first()
    if stolen_car:
        stolen_car.last_seen_location = location
        # stolen_car.status = "found" # Optional: mark as found? Or just keep updating location.
        db.commit()
        return {"message": "Stolen car sighted! Location updated.", "found": True}
    return {"message": "Car not reported stolen.", "found": False}

@app.get("/")
def read_root():
    return {"message": "Smart Traffic Violation System API is running"}

@app.post("/drivers/", response_model=schemas.Driver)
def create_driver(
    name: str = Form(...),
    national_id: str = Form(...),
    license_number: str = Form(...),
    plate_number: str = Form(...),
    car_model: str = Form(...),
    car_color: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    # current_user: models.User = Depends(get_current_admin) # Keep it open for now for easier testing, or uncomment to protect
    # Let's PROTECT it to verify requirements
    current_user: models.User = Depends(get_current_admin)
):
    # check if driver exists
    db_driver = db.query(models.Driver).filter(models.Driver.national_id == national_id).first()
    if db_driver:
        raise HTTPException(status_code=400, detail="Driver with this National ID already registered")
    
    # Save Image
    file_location = None
    if file and file.filename:
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        extension = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{extension}"
        # We save the file to the absolute path
        file_path = os.path.join(UPLOADS_DIR, new_filename)
        # But we store the relative URL in the DB
        file_location = f"uploads/{new_filename}" 
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    # Create Driver
    new_driver = models.Driver(
        name=name,
        national_id=national_id,
        license_number=license_number,
        photo_url=file_location
    )
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)

    # Create User Account for Driver (Username=NationalID, Pass=NationalID)
    hashed_password = auth.get_password_hash(national_id)
    new_user = models.User(
        username=national_id,
        hashed_password=hashed_password,
        role="driver",
        driver_id=new_driver.id
    )
    db.add(new_user)
    db.commit()

    # Create Car
    new_car = models.Car(
        plate_number=plate_number,
        model=car_model,
        color=car_color,
        owner_id=new_driver.id
    )
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    
    db.refresh(new_driver)
    return new_driver

@app.get("/drivers/", response_model=List[schemas.Driver])
def read_drivers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    # Protect this too
    drivers = db.query(models.Driver).offset(skip).limit(limit).all()
    return drivers

@app.get("/verify/{plate_number}", response_model=schemas.Driver)
def verify_plate(plate_number: str, db: Session = Depends(get_db)):
    # This might be used by the AI script, so maybe keep it unprotected for now? 
    # Or protect with a special API key. For simplicity, unprotected for AI.
    car = db.query(models.Car).filter(models.Car.plate_number == plate_number).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car.owner

# Public endpoint for QR Code scanning
@app.get("/public/drivers/{driver_id}", response_model=schemas.Driver)
def get_public_driver_profile(driver_id: int, db: Session = Depends(get_db)):
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

# Static files for images
# Ensure uploads directory exists
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)
