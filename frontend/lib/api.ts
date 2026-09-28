// frontend/lib/api.ts
import { Event, BookingRequest, BookingConfirmation } from "@/types/event";
import { MOCK_EVENTS } from "@/data/mockEvents";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch all events with optional category, city, and search query filters.
 * Resiliently falls back to mock data if backend service is unreachable.
 */
export async function getEvents(params?: {
  category?: string;
  city?: string;
  q?: string;
}): Promise<{ data: Event[]; isLive: boolean; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== "All") {
      searchParams.set("category", params.category);
    }
    if (params?.city && params.city !== "All Cities") {
      searchParams.set("city", params.city);
    }
    if (params?.q && params.q.trim()) {
      searchParams.set("q", params.q.trim());
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/events${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store", // Always fetch fresh data in development
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API responded with HTTP ${res.status}: ${res.statusText}`);
    }

    const data: Event[] = await res.json();
    return { data, isLive: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to connect to backend";
    console.warn(`[EventHub API] Falling back to local dataset. Reason: ${errorMsg}`);

    // Client-side fallback filter over mock dataset
    let filtered = MOCK_EVENTS;
    if (params?.category && params.category !== "All") {
      filtered = filtered.filter((e) => e.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.city && params.city !== "All Cities") {
      filtered = filtered.filter((e) => e.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params?.q && params.q.trim()) {
      const q = params.q.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return { data: filtered, isLive: false, error: errorMsg };
  }
}

/**
 * Fetch a single event by ID.
 */
export async function getEventById(id: string): Promise<{ data: Event | null; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return { data: null, isLive: true };
      throw new Error(`HTTP ${res.status}`);
    }

    const data: Event = await res.json();
    return { data, isLive: true };
  } catch {
    const mock = MOCK_EVENTS.find((e) => e.id === id) || null;
    return { data: mock, isLive: false };
  }
}

/**
 * Submit booking reservation to FastAPI backend.
 */
export async function createBooking(
  booking: BookingRequest
): Promise<BookingConfirmation> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Booking failed with HTTP ${res.status}`);
  }

  return res.json();
}
