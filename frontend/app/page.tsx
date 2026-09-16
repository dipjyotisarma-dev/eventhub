// frontend/app/page.tsx
import { MOCK_EVENTS } from "@/data/mockEvents";
import EventDiscovery from "@/components/EventDiscovery";
import Link from "next/link";

export default function HomePage() {
  const featuredEvent = MOCK_EVENTS.find((e) => e.isFeatured) || MOCK_EVENTS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Editorial Spotlight Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-900/10 bg-zinc-950 p-6 sm:p-10 text-white shadow-xl">
        {/* Ambient subtle light wash */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-orange-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Spotlight Event
            </span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
              {featuredEvent.city} • {featuredEvent.venue}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {featuredEvent.title}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 line-clamp-2 leading-relaxed">
            {featuredEvent.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/events/${featuredEvent.id}`}
              className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-zinc-200"
            >
              Get Tickets — ₹{featuredEvent.price}
            </Link>
            <span className="text-xs text-zinc-400 font-medium">
              📅 {new Date(featuredEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {featuredEvent.time}
            </span>
          </div>
        </div>
      </section>

      {/* Main Event Discovery Engine (Search, Multi-Filter, Responsive Event Grid) */}
      <EventDiscovery initialEvents={MOCK_EVENTS} />
    </div>
  );
}
