import hashlib

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models
import schemas


def hash_password(password: str) -> str:
    """Simple password hashing for a beginner project."""
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(db: Session, user: schemas.UserCreate):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, login_data: schemas.UserLogin):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or user.password != hash_password(login_data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user


def get_events(db: Session):
    return db.query(models.Event).all()


def get_event(db: Session, event_id: int):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


def get_event_seats(db: Session, event_id: int):
    event = get_event(db, event_id)
    return (
        db.query(models.Seat)
        .filter(models.Seat.event_id == event.id)
        .order_by(models.Seat.id)
        .all()
    )


def _format_booking_response(booking: models.Booking):
    return {
        "booking_id": booking.id,
        "event_title": booking.event.title,
        "seat_number": booking.seat.seat_number,
        "booking_time": booking.booking_time,
    }


def create_booking(db: Session, booking_data: schemas.BookingCreate):
    user = db.query(models.User).filter(models.User.id == booking_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    event = db.query(models.Event).filter(models.Event.id == booking_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    seat = db.query(models.Seat).filter(models.Seat.id == booking_data.seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")

    if seat.event_id != event.id:
        raise HTTPException(status_code=400, detail="Selected seat does not belong to this event")

    # Important interview logic:
    # Before creating a booking, the backend checks whether the selected seat
    # is already booked. If it is booked, we stop here and do not create a
    # booking record. This prevents duplicate seat booking.
    if seat.is_booked:
        raise HTTPException(
            status_code=400,
            detail="Seat is already booked. Please choose another seat.",
        )

    booking = models.Booking(
        user_id=user.id,
        event_id=event.id,
        seat_id=seat.id,
    )

    # Transaction-like flow:
    # 1. Create the booking.
    # 2. Mark the seat as booked.
    # 3. Commit only after both changes are ready.
    # If commit fails, rollback keeps the database consistent.
    seat.is_booked = True
    db.add(booking)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Seat is already booked. Please choose another seat.",
        )

    db.refresh(booking)
    return _format_booking_response(booking)


def get_user_bookings(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.user_id == user_id)
        .order_by(models.Booking.booking_time.desc())
        .all()
    )
    return [_format_booking_response(booking) for booking in bookings]


def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can cancel only your own booking")

    seat = booking.seat
    seat_number = seat.seat_number

    # Cancellation logic:
    # When a booking is cancelled, we free the seat again by setting
    # is_booked to False and delete the booking record in the same commit.
    # This keeps seat availability and booking history consistent.
    seat.is_booked = False
    db.delete(booking)
    db.commit()

    return {
        "message": "Booking cancelled successfully",
        "booking_id": booking_id,
        "seat_number": seat_number,
    }
