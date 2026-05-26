"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Aurora blobs */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
          <div className="animate-aurora-1 absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="animate-aurora-2 absolute -bottom-40 right-10 size-[28rem] rounded-full bg-purple-500/15 blur-3xl" />
          <div className="animate-aurora-3 absolute left-1/4 top-1/3 size-72 rounded-full bg-blue-500/15 blur-3xl" />

          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-background/40" />

          {/* Border glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

          {/* Content */}
          <div className="relative z-10 px-6 py-20 text-center sm:px-16 sm:py-28 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white"
            >
              <Sparkles className="size-3.5" />
              Ready to begin?
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Start your journey today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mx-auto mt-4 max-w-xl text-balance text-base text-white/70 sm:text-lg"
            >
              Ready to transform the way you plan your travels? Let AI craft
              your perfect itinerary in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                className="h-12 rounded-full bg-white px-8 text-base font-medium text-foreground shadow-lg shadow-white/20 hover:bg-white/90"
              >
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10"
              >
                View Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
