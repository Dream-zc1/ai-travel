"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import type { Destination } from "./destination-data";

interface FeaturedCardProps {
  destination: Destination;
}

export function FeaturedCard({ destination }: FeaturedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      className="group relative aspect-[4/5] h-full w-full overflow-hidden rounded-2xl md:aspect-auto"
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
      <div className="absolute inset-0 transition-colors duration-500 group-hover:bg-background/10" />

      {/* Top-right rating badge */}
      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
        <Star className="size-3 fill-amber-400 text-amber-400" />
        {destination.rating}
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {destination.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background/40 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {destination.city}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {destination.country}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {destination.description}
        </p>

        {/* Hover CTA */}
        <div className="mt-4 flex items-center gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <span className="text-sm font-medium">Explore destination</span>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
