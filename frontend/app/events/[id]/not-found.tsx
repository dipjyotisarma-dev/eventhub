// frontend/app/events/[id]/not-found.tsx
import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
        Event Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        The event you are looking for does not exist, has ended, or may have been removed from the platform.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Back to All Events
        </Link>
      </div>
    </div>
  );
}
