// frontend/components/EventDiscovery.tsx
"use client";

import { useState } from "react";
import { Event, EventCategory } from "@/types/event";
import EventCard from "@/components/EventCard";

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

export default function EventDiscovery({ initialEvents }: EventDiscoveryProps) {
  // 1. React State: Remembering search term and active category across renders
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EventCategory>("All");

  // 2. Derived State: Computing filtered list on-the-fly (No redundant state variables)
  const filteredEvents = initialEvents.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-8">
      {/* Search Bar & Category Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input (Controlled Component) */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, topic, or city..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {selectedCategory === "All" ? "All Events" : `${selectedCategory} Events`}
          <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found)
          </span>
        </h2>
        {(searchQuery || selectedCategory !== "All") && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Conditional Rendering: Event Grid vs Empty State */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-800">
            🔍
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
            No events found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            We couldn&apos;t find any events matching &quot;{searchQuery}&quot; in {selectedCategory}. Try searching for another topic or resetting filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
