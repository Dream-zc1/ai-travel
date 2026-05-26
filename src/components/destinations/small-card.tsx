"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Destination } from "./destination-data";

interface SmallCardProps {
  destination: Destination;
  index?: number;
  variant?: "stacked" | "bottom";
}

export function SmallCard({
  destination,
  index = 0,
  variant = "stacked",
}: SmallCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: 0.1 + index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.1, 0, 1],
      }}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes={
            variant === "stacked"
              ? "(max-width: 768px) 100vw, 25vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
      <div className="absolute inset-0 transition-colors duration-500 group-hover:bg-background/10" />

      {/* Rating */}
      <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md">
        <Star className="size-2.5 fill-amber-400 text-amber-400" />
        {destination.rating}
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-base font-bold tracking-tight">
          {destination.city}
        </h3>
        <p className="text-xs text-muted-foreground">
          {destination.country}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background/40 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
