// frontend/components/EventCard.tsx
import { Event } from "@/types/event";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Music: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Workshop: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Sports: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Business: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
};

export default function EventCard({ event }: EventCardProps) {
  // Format ISO date string into readable format (e.g., "15 Oct 2026")
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const categoryStyle = CATEGORY_COLORS[event.category] || "bg-zinc-100 text-zinc-800 border-zinc-200";

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div>
        {/* Top bar: Category Badge & Featured Tag */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryStyle}`}>
            {event.category}
          </span>
          {event.isFeatured && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40">
              ★ Featured
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition dark:text-white dark:group-hover:text-indigo-400">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {event.description}
        </p>

        {/* Meta Info: Date & Location */}
        <div className="mt-4 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Price</span>
          <p className="text-base font-bold text-zinc-900 dark:text-white">
            {event.price === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">Free</span>
            ) : (
              `₹${event.price}`
            )}
          </p>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
