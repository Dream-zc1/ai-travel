"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "./experiences-data";

interface ExperienceCardProps {
  experience: Review;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative aspect-[3/2] w-[85vw] shrink-0 overflow-hidden rounded-3xl sm:w-[75vw] md:w-[65vw] lg:w-[58vw] xl:w-[50vw]"
    >
      {/* Photo */}
      <div className="absolute inset-0">
        <Image
          src={experience.photo}
          alt={experience.destination}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 65vw, 50vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent dark:from-background/95 dark:via-background/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10 dark:from-background/20 dark:via-transparent dark:to-background/10" />
      <div className="absolute inset-0 transition-colors duration-500 group-hover:bg-black/20 dark:group-hover:bg-background/10" />

      {/* Destination badge — top left */}
      <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
        <span className="inline-flex items-center rounded-full bg-background/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md">
          {experience.destination}
        </span>
      </div>

      {/* Stars — top right */}
      <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-background/50 px-3 py-1 backdrop-blur-md">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`size-3 ${
                i < experience.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-foreground/20"
              }`}
            />
          ))}
        </span>
      </div>

      {/* Content — bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
        {/* Review text */}
        <p className="text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
          &ldquo;{experience.review}&rdquo;
        </p>

        {/* User info */}
        <div className="mt-3 flex items-center gap-3 sm:mt-4">
          <Image
            src={experience.userAvatar}
            alt={experience.userName}
            width={32}
            height={32}
            className="size-8 rounded-full ring-2 ring-white/20"
          />
          <div>
            <span className="text-sm font-medium text-white">
              {experience.userName}
            </span>
            <span className="ml-2 text-xs text-white/60">
              {experience.date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
