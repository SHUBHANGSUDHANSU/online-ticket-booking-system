from datetime import date, timedelta

import models


def seed_data(db):
    """Add missing sample events and seats without duplicating existing data."""
    today = date.today()
    sample_events = [
        {
            "title": "Python Developer Meetup",
            "description": "A beginner-friendly meetup for Python and FastAPI learners.",
            "venue": "Tech Hub Auditorium",
            "date": (today + timedelta(days=10)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Startup Networking Night",
            "description": "An evening event for students, founders, and software engineers.",
            "venue": "City Convention Center",
            "date": (today + timedelta(days=18)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Frontend Basics Workshop",
            "description": "A practical workshop covering React components and state management.",
            "venue": "Innovation Lab",
            "date": (today + timedelta(days=25)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Data Structures Bootcamp",
            "description": "A practical session on arrays, linked lists, stacks, queues, and trees.",
            "venue": "Code Academy Hall",
            "date": (today + timedelta(days=32)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Backend API Workshop",
            "description": "Build and test beginner-friendly REST APIs with request and response flows.",
            "venue": "Developer Training Center",
            "date": (today + timedelta(days=40)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Database Design Seminar",
            "description": "Learn tables, relationships, foreign keys, indexes, and normalization basics.",
            "venue": "Central Library Auditorium",
            "date": (today + timedelta(days=47)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Cloud Computing Meetup",
            "description": "Introductory talks on cloud deployment, hosting, and backend application basics.",
            "venue": "Skyline Business Center",
            "date": (today + timedelta(days=55)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "System Design for Freshers",
            "description": "A simple introduction to requirements, APIs, databases, and scaling ideas.",
            "venue": "Tech Park Seminar Room",
            "date": (today + timedelta(days=63)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Open Source Contribution Day",
            "description": "Learn how to read issues, make pull requests, and contribute to projects safely.",
            "venue": "Community Coding Space",
            "date": (today + timedelta(days=70)).isoformat(),
            "total_seats": 10,
        },
        {
            "title": "Cybersecurity Basics Talk",
            "description": "An introduction to passwords, common web risks, and secure coding practices.",
            "venue": "Security Innovation Room",
            "date": (today + timedelta(days=78)).isoformat(),
            "total_seats": 10,
        },
    ]

    for event_data in sample_events:
        existing_event = (
            db.query(models.Event)
            .filter(models.Event.title == event_data["title"])
            .first()
        )
        if existing_event:
            continue

        event = models.Event(**event_data)
        db.add(event)
        db.flush()

        for seat_number in range(1, event.total_seats + 1):
            seat = models.Seat(
                event_id=event.id,
                seat_number=f"S{seat_number}",
                is_booked=False,
            )
            db.add(seat)

    db.commit()
