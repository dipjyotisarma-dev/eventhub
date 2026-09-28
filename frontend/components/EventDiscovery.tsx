// frontend/components/EventDiscovery.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Event, EventCategory } from "@/types/event";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/api";

interface EventDiscoveryProps {
  initialEvents: Event[];
}

const CATEGORIES: ("All" | EventCategory)[] = [
  "All",
  "Tech",
  "Music",
  "Workshop",
  "Sports",
  "Business",
];

const CITIES = ["All Cities", "Bengaluru", "Mumbai", "Hyderabad", "New Delhi"];

export default function EventDiscovery({ initialEvents }: EventDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EventCategory>("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Paid">("All");

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch events from FastAPI backend
  const fetchFilteredEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await getEvents({
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      city: selectedCity !== "All Cities" ? selectedCity : undefined,
      q: searchQuery.trim() || undefined,
    });

    setIsBackendConnected(res.isLive);
    if (res.error && !res.isLive) {
      // Backend is offline, but fallback was used
      setErrorMessage("FastAPI backend is offline. Using local dataset.");
    }

    // Apply client-side price filter if needed
    let data = res.data;
    if (priceFilter === "Free") {
      data = data.filter((e) => e.price === 0);
    } else if (priceFilter === "Paid") {
      data = data.filter((e) => e.price > 0);
    }

    setEvents(data);
    setIsLoading(false);
  }, [selectedCategory, selectedCity, searchQuery, priceFilter]);

  // Trigger fetch with slight debounce on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredEvents();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchFilteredEvents]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All" ||
    selectedCity !== "All Cities" ||
    priceFilter !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedCity("All Cities");
    setPriceFilter("All");
  };

  return (
    <section id="events" className="space-y-8">
      {/* Backend Status Indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            {isBackendConnected
              ? "Connected to FastAPI Backend (port 8000)"
              : "Running in Offline Mode (Mock fallback)"}
          </span>
        </div>
        {errorMessage && (
          <span className="text-[11px] text-amber-600 dark:text-amber-400">
            {errorMessage}
          </span>
        )}
      </div>

      {/* Search & Multi-Filter Controls */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, speaker, organizer, or venue..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:placeholder-zinc-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Selectors: City & Price */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-800 transition hover:border-zinc-300 focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Price Segmented Filter */}
            <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
              {(["All", "Free", "Paid"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setPriceFilter(filter)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    priceFilter === filter
                      ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-900 dark:text-white"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div id="categories" className="mt-4 flex items-center gap-1.5 overflow-x-auto border-t border-zinc-100 pt-3 pb-1 dark:border-zinc-800 no-scrollbar">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mr-2 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discovery Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {selectedCategory === "All" ? "All Upcoming Events" : `${selectedCategory} Gatherings`}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Showing {events.length} {events.length === 1 ? "event" : "events"} in {selectedCity}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400"
          >
            <span>Reset filters</span>
            <span>✕</span>
          </button>
        )}
      </div>

      {/* Conditional UI States: Loading vs Grid vs Empty */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        /* Event Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 px-6 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-bold text-zinc-950 dark:text-white">
            No events found
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            No listings matched your active filters. Try searching for broader keywords, switching cities, or clearing category restrictions.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
}
