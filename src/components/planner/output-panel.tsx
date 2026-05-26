"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { usePlannerContext } from "./planner-context";
import { PlanSkeleton } from "./plan-skeleton";
import { ItineraryTimeline } from "./itinerary-timeline";
import { GenerationStatus } from "./generation-status";

export function OutputPanel() {
  const { itinerary, generationStep, isLoading, error, reload, currentQuery, history, historyQueries, selectHistory } = usePlannerContext();
  const hasGeneratedRef = useRef(false);

  // Once generation starts, never show the idle sample plan again
  if (isLoading || itinerary || error) {
    hasGeneratedRef.current = true;
  }

  const isStreaming = isLoading && !!itinerary;
  const isLoadingFirst = isLoading && !itinerary;

  // Error state
  if (error && !isStreaming) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
        className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center"
      >
        <AlertCircle className="size-10 text-destructive/60" />
        <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {error.message || "Failed to generate itinerary. Please try again."}
        </p>
        <button
          type="button"
          onClick={() => reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      </motion.div>
    );
  }

  // Loading skeleton + reasoning
  if (isLoadingFirst) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <GenerationStatus step={generationStep} query={currentQuery} />
        <PlanSkeleton />
      </motion.div>
    );
  }

  // Result (streaming or final)
  if (itinerary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
        className="space-y-4"
      >
        {isStreaming && <GenerationStatus step={generationStep} query={currentQuery} />}

        {/* History switcher */}
        {history.length > 0 && !isStreaming && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground/50">Past trips:</span>
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => selectHistory(i)}
                className="rounded-full border border-border/30 bg-white/5 px-3 py-1 text-xs text-foreground/70 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-white"
              >
                {historyQueries[i]?.slice(0, 24) || h.title?.slice(0, 24)}
                {h.title?.length > 24 && "..."}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm sm:p-7">
          <ItineraryTimeline itinerary={itinerary} />
        </div>
      </motion.div>
    );
  }

  // Idle — welcome state before first generation
  if (!hasGeneratedRef.current) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-b from-primary/[0.04] via-primary/[0.01] to-background py-24"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[20%] size-2 rounded-full bg-primary/10" />
          <div className="absolute right-[20%] top-[30%] size-3 rounded-full bg-primary/15" />
          <div className="absolute bottom-[25%] left-[25%] size-1.5 rounded-full bg-primary/10" />
          <div className="absolute right-[30%] top-[60%] size-2 rounded-full bg-primary/8" />
          <div className="absolute left-[10%] bottom-[30%] size-1 rounded-full bg-primary/12" />
          {/* Decorative route line */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
            width="320"
            height="200"
            viewBox="0 0 320 200"
            fill="none"
          >
            <path
              d="M10 100 Q80 20 160 100 T310 100"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="text-primary"
            />
            <circle cx="10" cy="100" r="4" fill="currentColor" className="text-primary/60" />
            <circle cx="160" cy="100" r="5" fill="currentColor" className="text-primary/40" />
            <circle cx="310" cy="100" r="4" fill="currentColor" className="text-primary/60" />
          </svg>
        </div>

        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 shadow-lg shadow-primary/5">
            <svg
              className="size-10 text-primary/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </motion.div>

        {/* Text */}
        <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground/80">
          Ready to plan your trip?
        </h3>
        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground/60 leading-relaxed">
          Type a destination in the search bar above and let AI craft a complete,
          personalized itinerary — from hidden gems to local favorites.
        </p>

        {/* Example suggestions */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["Tokyo food tour", "Paris 3 days", "Bali adventure", "Xi'an culture"].map(
            (example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>(
                    'input[placeholder="Where do you want to go?"]',
                  );
                  if (input) {
                    input.value = example;
                    input.focus();
                    // Dispatch an input event so React state picks it up
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value",
                    )?.set;
                    nativeInputValueSetter?.call(input, example);
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }}
                className="rounded-full border border-primary/15 bg-primary/[0.04] px-4 py-1.5 text-xs text-foreground/60 transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-foreground/90"
              >
                {example}
              </button>
            ),
          )}
        </div>
      </motion.div>
    );
  }

  return null;
}
