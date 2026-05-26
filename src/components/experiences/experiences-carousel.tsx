"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "./experiences-data";
import { ExperienceCard } from "./experience-card";

export function ExperiencesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="group relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/60 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-background/80 md:block md:opacity-0 md:group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/60 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-background/80 md:block md:opacity-0 md:group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide overflow-x-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="flex items-stretch gap-4 pl-4 sm:gap-6 sm:pl-6 lg:pl-8"
        >
          {reviews.map((review) => (
            <ExperienceCard key={review.id} experience={review} />
          ))}
          {/* End spacer for scroll alignment */}
          <div className="w-4 shrink-0 sm:w-6 lg:w-8" />
        </motion.div>
      </div>
    </div>
  );
}
