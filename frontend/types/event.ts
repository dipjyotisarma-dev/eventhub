// frontend/types/event.ts

export type EventCategory = "Tech" | "Music" | "Workshop" | "Sports" | "Business";

export type EventStatus = "Selling Fast" | "Almost Full" | "Registration Open" | "Sold Out";

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
  price: number;           // Price in INR (0 = Free)
  availableTickets: number;
  totalTickets: number;
  status: EventStatus;
  tags: string[];
  isFeatured?: boolean;
  posterTheme?: string;    // Curated aesthetic theme for poster banner
}
