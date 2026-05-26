"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "./testimonials-data";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative break-inside-avoid rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border/60 hover:shadow-md sm:p-7"
    >
      {/* Quote icon */}
      <Quote className="absolute right-5 top-5 size-8 text-primary/10" />

      {/* Stars */}
      <div className="mb-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-4 ${
              i < testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3 border-t border-border/20 pt-4">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {testimonial.role} · {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
