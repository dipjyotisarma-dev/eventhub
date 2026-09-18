// frontend/components/CheckoutModal.tsx
"use client";

import { useState } from "react";
import { Event, TicketTier, BookingConfirmation } from "@/types/event";
import Link from "next/link";

interface CheckoutModalProps {
  event: Event;
  selectedTier: TicketTier;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({
  event,
  selectedTier,
  quantity,
  isOpen,
  onClose,
}: CheckoutModalProps) {
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  if (!isOpen) return null;

  const totalAmount = selectedTier.price * quantity;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!attendeeName.trim()) {
      setError("Please provide your full legal name.");
      return;
    }

    if (!attendeeEmail.trim() || !attendeeEmail.includes("@")) {
      setError("Please provide a valid email address to receive your tickets.");
      return;
    }

    setIsProcessing(true);

    // Simulate realistic async network roundtrip (1.2s delay)
    setTimeout(() => {
      setIsProcessing(false);
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      setConfirmation({
        bookingId: `EH-2026-${randomCode}`,
        eventId: event.id,
        eventTitle: event.title,
        tierName: selectedTier.name,
        quantity,
        totalAmount,
        attendeeName,
        attendeeEmail,
        bookingDate: new Date().toISOString(),
      });
    }, 1200);
  };

  const handleResetAndClose = () => {
    setConfirmation(null);
    setAttendeeName("");
    setAttendeeEmail("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 disabled:opacity-50"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* State 1: Booking Success Voucher */}
        {confirmation ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 id="modal-headline" className="text-lg font-bold text-zinc-950 dark:text-white">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Your pass has been generated and verified.
                </p>
              </div>
            </div>

            {/* Ticket Voucher Display */}
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Booking Reference
                </span>
                <span className="font-mono text-xs font-bold text-zinc-950 dark:text-white">
                  {confirmation.bookingId}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Event
                </span>
                <p className="text-sm font-bold text-zinc-950 dark:text-white line-clamp-1">
                  {confirmation.eventTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Tier & Qty
                  </span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">
                    {confirmation.tierName} × {confirmation.quantity}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Total Charged
                  </span>
                  <p className="font-bold text-zinc-950 dark:text-white">
                    {confirmation.totalAmount === 0 ? "Free RSVP" : `₹${confirmation.totalAmount}`}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-2.5 dark:border-zinc-800 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Attendee
                </span>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {confirmation.attendeeName} ({confirmation.attendeeEmail})
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResetAndClose}
                className="flex-1 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Done
              </button>
              <Link
                href="/"
                onClick={handleResetAndClose}
                className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        ) : (
          /* State 2: Checkout Form */
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            <div>
              <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Mock Checkout
              </span>
              <h3 id="modal-headline" className="mt-1.5 text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Review & Confirm Reservation
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Complete your details below. No real payment will be charged.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-600 dark:text-zinc-400">{event.title}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Tier: {selectedTier.name}</span>
                <span>
                  {selectedTier.price === 0 ? "Free" : `₹${selectedTier.price}`} × {quantity}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-zinc-950 dark:border-zinc-700 dark:text-white text-sm">
                <span>Total Due:</span>
                <span>{totalAmount === 0 ? "Free RSVP" : `₹${totalAmount}`}</span>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Attendee Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="e.g. arjun@example.com"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                disabled={isProcessing}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-500 disabled:opacity-75"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Reservation...
                  </span>
                ) : (
                  totalAmount === 0 ? "Confirm Free RSVP" : `Pay ₹${totalAmount} & Confirm`
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
