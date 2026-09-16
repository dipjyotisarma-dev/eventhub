// frontend/app/page.tsx
import { MOCK_EVENTS } from "@/data/mockEvents";
import EventCard from "@/components/EventCard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          Discover Upcoming <span className="text-indigo-600 dark:text-indigo-400">Events</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Explore top tech summits, developer workshops, music concerts, and business mixers in your city.
        </p>
      </div>

      {/* Section Title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Featured & Upcoming Events ({MOCK_EVENTS.length})
        </h2>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
