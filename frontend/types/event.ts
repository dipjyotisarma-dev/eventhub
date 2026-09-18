// frontend/types/event.ts

export type EventCategory = "Tech" | "Music" | "Workshop" | "Sports" | "Business";

export type EventStatus = "Selling Fast" | "Almost Full" | "Registration Open" | "Sold Out";

export interface TicketTier {
  id: string;
  name: string;          // e.g. "General Admission", "VIP Pass"
  description: string;   // e.g. "Full summit access + workshop recordings"
  price: number;         // Price in INR (₹)
  available: number;     // Remaining tickets in this tier
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;            // ISO string e.g. "2026-10-15T09:00:00Z"
  time: string;            // Formatted time range e.g. "09:00 AM – 05:30 PM"
  venue: string;           // Specific hall / club / arena name
  city: string;            // City name e.g. "Bengaluru"
  organizer: string;       // Hosting organization or individual
  price: number;           // Base starting price in INR (0 = Free)
  availableTickets: number;
  totalTickets: number;
  status: EventStatus;
  tags: string[];
  isFeatured?: boolean;
  posterTheme?: string;    // Curated aesthetic theme for poster banner
  ticketTiers: TicketTier[];
  agenda?: AgendaItem[];
}

export interface BookingRequest {
  eventId: string;
  tierId: string;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
}

export interface BookingConfirmation {
  bookingId: string;
  eventId: string;
  eventTitle: string;
  tierName: string;
  quantity: number;
  totalAmount: number;
  attendeeName: string;
  attendeeEmail: string;
  bookingDate: string;
}
