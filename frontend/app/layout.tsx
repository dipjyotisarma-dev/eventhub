// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHub — Curated Events & Experiences",
  description: "Discover and book premier tech conferences, developer workshops, indie live concerts, and exclusive community gatherings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} flex min-h-full flex-col bg-zinc-50/50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50 selection:bg-orange-500 selection:text-white`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-zinc-200/80 bg-white py-12 text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-950 dark:text-white">
                  Event<span className="text-orange-600 dark:text-orange-500">Hub</span>
                </span>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  The discovery & ticketing platform for modern creators, engineers, and communities.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <Link href="#events" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Explore Events
                </Link>
                <Link href="/create" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Host an Experience
                </Link>
                <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-100 pt-6 text-[11px] text-zinc-400 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© 2026 EventHub Inc. All rights reserved.</p>
              <p>Built with Next.js, TypeScript & FastAPI.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
