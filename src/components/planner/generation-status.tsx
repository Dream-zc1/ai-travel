"use client";

import { AnimatePresence, motion } from "framer-motion";

const GENERATION_STEPS = [
  "Analyzing destination",
  "Finding hidden gems",
  "Optimizing travel pacing",
  "Selecting food experiences",
  "Planning transportation",
  "Generating itinerary",
];

type Props = {
  step: number;
  query?: string;
};

export function GenerationStatus({ step, query }: Props) {
  const currentStep = GENERATION_STEPS[Math.min(step, GENERATION_STEPS.length - 1)];

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      {/* User's query */}
      {query && (
        <div className="mb-1 max-w-md truncate rounded-lg bg-white/5 px-4 py-2 text-sm text-foreground/70">
          <span className="text-xs text-muted-foreground/50">Planning: </span>
          {query}
        </div>
      )}

      {/* Pulse dot + current step */}
      <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
          <span className="inline-flex size-2 rounded-full bg-primary" />
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-foreground/90"
          >
            {currentStep}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Subtle helper */}
      <p className="text-xs text-muted-foreground/60">
        AI is crafting your personalized itinerary
      </p>
    </div>
  );
}
