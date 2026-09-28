# backend/models.py
from typing import Literal, Optional, List
from pydantic import BaseModel, Field

EventCategory = Literal["Tech", "Music", "Workshop", "Sports", "Business"]
EventStatus = Literal["Selling Fast", "Almost Full", "Registration Open", "Sold Out"]

class TicketTier(BaseModel):
    id: str
    name: str
    description: str
    price: int = Field(ge=0, description="Price in INR (0 = Free)")
    available: int = Field(ge=0, description="Available ticket count")

class AgendaItem(BaseModel):
    time: str
    title: str
    speaker: Optional[str] = None
    description: Optional[str] = None

class Event(BaseModel):
    id: str
    title: str
    description: str
    category: EventCategory
    date: str
    time: str
    venue: str
    city: str
    organizer: str
    price: int
    availableTickets: int
    totalTickets: int
    status: EventStatus
    tags: List[str]
    isFeatured: Optional[bool] = False
    posterTheme: Optional[str] = None
    ticketTiers: List[TicketTier]
    agenda: Optional[List[AgendaItem]] = None

class BookingRequest(BaseModel):
    eventId: str
    tierId: str
    quantity: int = Field(gt=0, le=5)
    attendeeName: str = Field(min_length=2)
    attendeeEmail: str = Field(min_length=5)

class BookingConfirmation(BaseModel):
    bookingId: str
    eventId: str
    eventTitle: str
    tierName: str
    quantity: int
    totalAmount: int
    attendeeName: str
    attendeeEmail: str
    bookingDate: str
