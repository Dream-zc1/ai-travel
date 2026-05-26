"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export function SectionHeader() {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
      >
        <Compass className="size-3.5" />
        Curated for you
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
      >
        Popular Destinations
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        className="mt-4 text-base text-muted-foreground sm:text-lg"
      >
        Hand-picked destinations our AI recommends for your next unforgettable
        journey.
      </motion.p>
    </div>
  );
}
