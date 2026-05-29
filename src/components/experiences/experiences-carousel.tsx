"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "./experiences-data";
import { ExperienceCard } from "./experience-card";

const PER_PAGE = 2;
const totalPages = Math.ceil(reviews.length / PER_PAGE);

export function ExperiencesCarousel() {
  const [page, setPage] = useState(0);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const current = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="group relative">
      {/* Left arrow */}
      <button
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/60 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-background/80 disabled:opacity-0"
        aria-label="Previous"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={!canNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/60 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-background/80 disabled:opacity-0"
        aria-label="Next"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Cards grid */}
      <div className="overflow-hidden px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
          >
            {current.map((review) => (
              <ExperienceCard key={review.id} experience={review} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === page
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
