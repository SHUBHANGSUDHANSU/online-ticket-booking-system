from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr


class LoginResponse(BaseModel):
    message: str
    user: UserResponse


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    venue: str
    date: str
    total_seats: int


class SeatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    seat_number: str
    is_booked: bool


class BookingCreate(BaseModel):
    user_id: int
    event_id: int
    seat_id: int


class BookingResponse(BaseModel):
    booking_id: int
    event_title: str
    seat_number: str
    booking_time: datetime


class CancelBookingResponse(BaseModel):
    message: str
    booking_id: int
    seat_number: str
