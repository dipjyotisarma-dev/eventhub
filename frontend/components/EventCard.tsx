// frontend/components/EventCard.tsx
import { Event } from "@/types/event";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

  const statusStyles: Record<string, string> = {
    "Almost Full": "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    "Selling Fast": "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
    "Registration Open": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    "Sold Out": "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400",
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white transition duration-200 hover:border-zinc-400/80 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-700">
      {/* Visual Poster Banner */}
      <div className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${event.posterTheme || "from-zinc-900 to-zinc-800"} p-4 flex flex-col justify-between`}>
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Badges: Category & Status */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-md bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-200 border border-white/10 uppercase">
            {event.category}
          </span>
          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm ${statusStyles[event.status] || ""}`}>
            {event.status}
          </span>
        </div>

        {/* Poster Bottom Info */}
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            {event.organizer}
          </p>
          <p className="text-xs font-semibold text-zinc-100 line-clamp-1">
            {event.venue}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Date + Title Grid */}
        <div className="flex items-start gap-4">
          {/* Stacked Calendar Date Lockup */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-center dark:border-zinc-800 dark:bg-zinc-950 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500">
              {month}
            </span>
            <span className="text-lg font-black tracking-tight text-zinc-950 dark:text-white tabular-nums leading-none my-0.5">
              {day}
            </span>
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {weekday}
            </span>
          </div>

          {/* Event Title & Time */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-snug tracking-tight text-zinc-950 transition group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400 line-clamp-2">
              <Link href={`/events/${event.id}`}>
                {event.title}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {event.time}
            </p>
          </div>
        </div>

        {/* Description snippet */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {event.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Card Footer: Price & Direct Booking Action */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
          <div>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
              Starting from
            </span>
            <p className="text-base font-bold text-zinc-950 dark:text-white tabular-nums">
              {event.price === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free RSVP</span>
              ) : (
                `₹${event.price}`
              )}
            </p>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </article>
  );
}
