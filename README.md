# Online Ticket Booking System

A simple full-stack ticket booking system built with FastAPI, SQLite, SQLAlchemy, and React. It focuses on backend API design, relational schema modelling, and preventing duplicate seat bookings.

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

## Deploy on Vercel

This project includes Vercel configuration for deploying the React frontend and FastAPI backend together.

```bash
npx vercel --prod
```

For Vercel, the frontend calls the backend through `/api`. SQLite runs from `/tmp` on Vercel serverless functions, so this deployment is suitable as a demo. For a production app, use a hosted database instead of SQLite.


