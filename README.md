# Online Ticket Booking System

A simple full-stack ticket booking system built with FastAPI, SQLite, SQLAlchemy, and React. This project is designed for a fresher SDE resume and focuses on backend APIs, database relationships, CRUD operations, and preventing duplicate seat booking.

## Project Overview

Users can register, login, view available events, select available seats, book tickets, and view their booking history. Authentication is intentionally simple: the login API returns user details, and the frontend stores the logged-in user in `localStorage`.

The main backend logic is in the booking API. Before creating a booking, the API checks whether the selected seat is already booked. If the seat is available, it creates a booking and marks the seat as booked in one commit.

## Features

- User registration with name, email, and password
- User login with email and password
- Event listing and event details
- Seat availability for each event
- Ticket booking for available seats
- Ticket cancellation with seat release
- Duplicate seat booking prevention
- User booking history
- Seed data with multiple sample events and 10 seats per event
- Swagger UI for API testing

## Tech Stack

- Backend: Python, FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- Frontend: React with Vite
- Styling: Basic CSS
- API Testing: FastAPI Swagger UI

## Database Schema

### users

Stores registered user details.

| Column | Description |
| --- | --- |
| id | Primary key |
| name | User name |
| email | Unique user email |
| password | Hashed password for this demo project |

### events

Stores event details.

| Column | Description |
| --- | --- |
| id | Primary key |
| title | Event title |
| description | Event description |
| venue | Event venue |
| date | Event date |
| total_seats | Total seats available for the event |

### seats

Stores seats for each event.

| Column | Description |
| --- | --- |
| id | Primary key |
| event_id | Foreign key linked to events |
| seat_number | Seat label such as S1, S2 |
| is_booked | Shows whether the seat is already booked |

### bookings

Stores ticket bookings.

| Column | Description |
| --- | --- |
| id | Primary key |
| user_id | Foreign key linked to users |
| event_id | Foreign key linked to events |
| seat_id | Foreign key linked to seats |
| booking_time | Date and time when ticket was booked |

## API Endpoints

Swagger UI is available at:

```text
http://127.0.0.1:8000/docs
```

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Register a new user |
| POST | `/login` | Login using email and password |
| GET | `/events` | Get all events |
| GET | `/events/{event_id}` | Get one event |
| GET | `/events/{event_id}/seats` | Get seats for an event |
| POST | `/bookings` | Book a ticket |
| GET | `/users/{user_id}/bookings` | Get booking history for a user |
| DELETE | `/bookings/{booking_id}?user_id={user_id}` | Cancel a booking and make the seat available again |

### Sample Booking Request

```json
{
  "user_id": 1,
  "event_id": 1,
  "seat_id": 1
}
```

If the seat is already booked, the API returns:

```json
{
  "detail": "Seat is already booked. Please choose another seat."
}
```

### Sample Cancel Booking Request

```text
DELETE /bookings/1?user_id=1
```

When a booking is cancelled, the backend deletes the booking record and updates the related seat as available again.

## How to Run Backend

Open a terminal in the project folder:

```bash
cd online-ticket-booking-system/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

The SQLite database file `ticket_booking.db` is created automatically in the `backend` folder. Seed data adds missing sample events without duplicating existing event titles.

## How to Run Frontend

Open another terminal:

```bash
cd online-ticket-booking-system/frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

If your backend is running on a different port, start the frontend with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8010 npm run dev
```

## Screenshots

Add screenshots here after running the project locally:

- Register page
- Login page
- Events page
- Seat selection page
- Booking history page

## Interview Explanation

This project is a basic online ticket booking system. I built it to understand backend API development, database relationships, and real-world booking logic. The main challenge was preventing duplicate seat booking. For that, whenever a user selects a seat, the backend first checks if the seat is already booked. If it is available, the system creates a booking entry and updates the seat status as booked. This keeps the booking data consistent.

I also added booking cancellation. When a user cancels a booking, the backend deletes the booking entry and marks the related seat as available again. This is done in one database commit so the booking and seat status stay consistent.

The backend uses FastAPI routes for user registration, login, event listing, seat listing, booking, and booking history. SQLAlchemy models define relationships between users, events, seats, and bookings. SQLite is used so the project can run locally without external setup.

## Resume Bullet Points

- Built a full-stack online ticket booking system using FastAPI, React, SQLite, and SQLAlchemy.
- Designed database tables and relationships for users, events, seats, and bookings.
- Implemented REST APIs for user registration, login, event listing, seat selection, ticket booking, cancellation, and booking history.
- Added duplicate seat booking prevention by checking seat availability before creating a booking and updating seat status.
- Created seed data for sample events and seats to make the project easy to test from Swagger UI.
