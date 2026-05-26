"use client";

import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { Stats } from "./stats";
import { TestimonialsGrid } from "./testimonials-grid";

export function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
        >
          <HeartHandshake className="size-3.5" />
          Trusted by travelers
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Loved by thousands
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Real stories from real travelers who turned their dream trips into
          reality with AI-powered planning.
        </motion.p>

        {/* Stats */}
        <div className="mt-12">
          <Stats />
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <TestimonialsGrid />
        </div>
      </div>
    </section>
  );
}
