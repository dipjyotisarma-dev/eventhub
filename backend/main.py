# backend/main.py
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from models import Event, BookingRequest, BookingConfirmation
from data import INITIAL_EVENTS

app = FastAPI(
    title="EventHub API",
    description="Minimal REST API backend for the EventHub Discovery & Booking Platform.",
    version="1.0.0",
)

# --------------------------------------------------
# CORS Middleware Configuration
# Allows Next.js frontend (port 3000) to communicate with FastAPI (port 8000)
# --------------------------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for events
events_db: List[Event] = [e.model_copy(deep=True) for e in INITIAL_EVENTS]


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "service": "eventhub-api", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/events", response_model=List[Event], tags=["Events"])
def list_events(
    category: Optional[str] = Query(None, description="Filter by category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    q: Optional[str] = Query(None, description="Search keyword in title, description, or venue"),
):
    """
    List events with optional search and filtering capabilities.
    """
    results = events_db

    if category and category != "All":
        results = [e for e in results if e.category.lower() == category.lower()]

    if city and city != "All Cities":
        results = [e for e in results if e.city.lower() == city.lower()]

    if q and q.strip():
        term = q.strip().lower()
        results = [
            e for e in results
            if term in e.title.lower()
            or term in e.description.lower()
            or term in e.venue.lower()
            or term in e.organizer.lower()
            or any(term in tag.lower() for tag in e.tags)
        ]

    return results


@app.get("/api/events/{event_id}", response_model=Event, tags=["Events"])
def get_event(event_id: str):
    """
    Retrieve single event details by its unique identifier.
    """
    for event in events_db:
        if event.id == event_id:
            return event
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Event with id '{event_id}' not found",
    )


@app.post("/api/bookings", response_model=BookingConfirmation, status_code=status.HTTP_201_CREATED, tags=["Bookings"])
def create_booking(booking: BookingRequest):
    """
    Create a mock ticket booking reservation and return verified confirmation voucher.
    """
    # 1. Verify event exists
    target_event = next((e for e in events_db if e.id == booking.eventId), None)
    if not target_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # 2. Verify tier exists
    target_tier = next((t for t in target_event.ticketTiers if t.id == booking.tierId), None)
    if not target_tier:
        raise HTTPException(status_code=400, detail="Invalid ticket tier selected")

    # 3. Check inventory
    if target_tier.available < booking.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Only {target_tier.available} tickets available in this tier",
        )

    # 4. Decrement available ticket counts
    target_tier.available -= booking.quantity
    target_event.availableTickets -= booking.quantity

    total_amount = target_tier.price * booking.quantity
    random_ref = random.randint(10000, 99999)

    return BookingConfirmation(
        bookingId=f"EH-2026-{random_ref}",
        eventId=target_event.id,
        eventTitle=target_event.title,
        tierName=target_tier.name,
        quantity=booking.quantity,
        totalAmount=total_amount,
        attendeeName=booking.attendeeName,
        attendeeEmail=booking.attendeeEmail,
        bookingDate=datetime.utcnow().isoformat(),
    )
