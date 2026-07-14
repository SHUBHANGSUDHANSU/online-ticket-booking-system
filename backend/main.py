from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import Base, SessionLocal, engine, get_db
from seed import seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title="Online Ticket Booking System",
    description="A simple FastAPI backend for event seat booking.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Online Ticket Booking System API is running"}


@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


@app.post("/login", response_model=schemas.LoginResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.login_user(db, login_data)
    return {"message": "Login successful", "user": user}


@app.get("/events", response_model=list[schemas.EventResponse])
def list_events(db: Session = Depends(get_db)):
    return crud.get_events(db)


@app.get("/events/{event_id}", response_model=schemas.EventResponse)
def event_details(event_id: int, db: Session = Depends(get_db)):
    return crud.get_event(db, event_id)


@app.get("/events/{event_id}/seats", response_model=list[schemas.SeatResponse])
def event_seats(event_id: int, db: Session = Depends(get_db)):
    return crud.get_event_seats(db, event_id)


@app.post("/bookings", response_model=schemas.BookingResponse)
def book_ticket(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    return crud.create_booking(db, booking)


@app.get("/users/{user_id}/bookings", response_model=list[schemas.BookingResponse])
def booking_history(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_bookings(db, user_id)


@app.delete("/bookings/{booking_id}", response_model=schemas.CancelBookingResponse)
def cancel_ticket(booking_id: int, user_id: int, db: Session = Depends(get_db)):
    return crud.cancel_booking(db, booking_id, user_id)
