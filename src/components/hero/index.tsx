"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroBackground } from "./hero-background";
import { HeroContent } from "./hero-content";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background layer */}
      <HeroBackground />

      {/* Main content */}
      <HeroContent />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
