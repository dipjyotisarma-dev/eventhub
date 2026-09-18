// frontend/app/events/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MOCK_EVENTS } from "@/data/mockEvents";
import TicketSelector from "@/components/TicketSelector";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) {
    return { title: "Event Not Found — EventHub" };
  }
  return {
    title: `${event.title} — EventHub`,
    description: event.description,
  };
}

export function generateStaticParams() {
  return MOCK_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/#events" className="hover:text-zinc-950 dark:hover:text-white transition">
          {event.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-950 dark:text-zinc-200 font-medium truncate max-w-xs sm:max-w-md">
          {event.title}
        </span>
      </nav>

      {/* Hero Poster Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${event.posterTheme || "from-zinc-900 to-zinc-800"} p-6 sm:p-10 text-white shadow-xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-md uppercase tracking-wide">
              {event.category}
            </span>
            <span className="rounded-md bg-orange-600/90 px-2.5 py-1 text-xs font-semibold text-white">
              {event.status}
            </span>
            <span className="text-xs text-zinc-300">
              Presented by <strong className="text-white">{event.organizer}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            {event.venue}, {event.city}
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Main Content Area (8 Cols) */}
        <div className="space-y-10 lg:col-span-7 xl:col-span-8">
          {/* Key Event Logistical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            {/* Date & Time */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Date & Timing
                </p>
                <p className="text-sm font-bold text-zinc-950 dark:text-white mt-0.5">
                  {formattedDate}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {event.time}
                </p>
              </div>
            </div>

            {/* Venue & City */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Location & Venue
                </p>
                <p className="text-sm font-bold text-zinc-950 dark:text-white mt-0.5">
                  {event.venue}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {event.city}, India
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              About This Event
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>{event.description}</p>
            </div>

            {/* Tags */}
            <div className="pt-2 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* Agenda Timeline (if present) */}
          {event.agenda && event.agenda.length > 0 && (
            <section className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Schedule & Agenda
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-900/40"
                  >
                    <div className="text-xs font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap tabular-nums w-36 shrink-0">
                      {item.time}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {item.title}
                      </h4>
                      {item.speaker && (
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mt-0.5">
                          {item.speaker}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organizer Attribution Card */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white font-bold text-base dark:bg-white dark:text-zinc-950">
                {event.organizer.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Organized By
                </p>
                <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                  {event.organizer}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Verified Host on EventHub
                </p>
              </div>
            </div>
            <Link
              href="/#events"
              className="hidden sm:inline-flex rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              More from host
            </Link>
          </section>
        </div>

        {/* Sidebar Sticky Ticket Selector (4 Cols) */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24">
            <TicketSelector event={event} />
          </div>
        </aside>
      </div>
    </div>
  );
}
