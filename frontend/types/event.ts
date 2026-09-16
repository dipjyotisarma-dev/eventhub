// frontend/types/event.ts

export type EventCategory = "Tech" | "Music" | "Workshop" | "Sports" | "Business";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;       // ISO string e.g. "2026-10-15T09:00:00Z"
  location: string;
  price: number;      // Price in INR (₹)
  availableTickets: number;
  imageUrl?: string;
  isFeatured?: boolean;
}
