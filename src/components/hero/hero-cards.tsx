"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80",
    title: "Paris",
    description: "City of Light",
    rating: 4.8,
    className: "-top-4 right-[15%]",
    delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80",
    title: "Tokyo",
    description: "Tradition meets future",
    rating: 4.9,
    className: "top-[20%] -left-4",
    delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80",
    title: "Dubai",
    description: "Architecture reimagined",
    rating: 4.7,
    className: "top-[15%] -right-6",
    delay: 0.4,
  },
  {
    src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=200&q=80",
    title: "Bali",
    description: "Island of gods",
    rating: 4.9,
    className: "-bottom-2 left-[10%]",
    delay: 0.45,
  },
];

function FloatingCard({
  src,
  title,
  description,
  rating,
  className,
  delay,
}: (typeof cards)[number]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.25, 0.1, 0, 1],
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={cn(
        "absolute hidden w-44 rounded-xl border bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl lg:block",
        className,
      )}
    >
      <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          sizes="176px"
        />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs font-medium">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {rating}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroCards() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {cards.map((card) => (
        <FloatingCard key={card.title} {...card} />
      ))}
    </div>
  );
}
