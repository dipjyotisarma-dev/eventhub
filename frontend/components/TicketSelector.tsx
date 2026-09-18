// frontend/components/TicketSelector.tsx
"use client";

import { useState } from "react";
import { Event, TicketTier } from "@/types/event";
import CheckoutModal from "@/components/CheckoutModal";

interface TicketSelectorProps {
  event: Event;
}

export default function TicketSelector({ event }: TicketSelectorProps) {
  const tiers = event.ticketTiers;
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const activeTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const maxAllowed = Math.min(5, activeTier?.available || 5);

  const handleTierChange = (tierId: string) => {
    setSelectedTierId(tierId);
    setQuantity(1); // Reset quantity when switching tiers
  };

  const handleIncrement = () => {
    if (quantity < maxAllowed) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const subtotal = (activeTier?.price || 0) * quantity;

  return (
    <>
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Select Tickets
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Choose your pass tier and quantity
            </p>
          </div>
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {event.status}
          </span>
        </div>

        {/* Tier Radio Options */}
        <div className="mt-4 space-y-3">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <div
                key={tier.id}
                onClick={() => handleTierChange(tier.id)}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-orange-500 bg-orange-50/20 ring-1 ring-orange-500 dark:border-orange-500 dark:bg-orange-950/10"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="ticket-tier"
                      checked={isSelected}
                      onChange={() => handleTierChange(tier.id)}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-zinc-950 dark:text-white">
                        {tier.name}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {tier.description}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        Only {tier.available} passes remaining
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-zinc-950 dark:text-white tabular-nums">
                      {tier.price === 0 ? "Free" : `₹${tier.price}`}
                    </span>
                    <span className="block text-[10px] text-zinc-400">per pass</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity Controls */}
        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            <span className="block text-xs font-semibold text-zinc-950 dark:text-white">
              Quantity
            </span>
            <span className="text-[11px] text-zinc-400">Max 5 tickets per reservation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= maxAllowed}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal & Checkout CTA */}
        <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-500 dark:text-zinc-400">Subtotal:</span>
            <span className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {subtotal === 0 ? "Free RSVP" : `₹${subtotal}`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="mt-4 w-full rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {subtotal === 0 ? "Reserve Free Pass" : "Proceed to Checkout"}
          </button>
          <p className="mt-2 text-center text-[11px] text-zinc-400">
            Instant booking confirmation • Non-binding mock checkout
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      {activeTier && (
        <CheckoutModal
          event={event}
          selectedTier={activeTier}
          quantity={quantity}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
}
