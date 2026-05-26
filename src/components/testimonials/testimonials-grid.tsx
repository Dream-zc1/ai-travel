"use client";

import { motion } from "framer-motion";
import { testimonials } from "./testimonials-data";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
      }}
      className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid"
    >
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </motion.div>
  );
}
