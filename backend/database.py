from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# SQLite keeps this project simple because no external database setup is needed.
SQLALCHEMY_DATABASE_URL = "sqlite:///./ticket_booking.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Provide a database session for each API request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
