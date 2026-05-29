"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PromptInput } from "./prompt-input";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0, 1] as const },
});

export function HeroContent() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
      {/* Badge */}
      <motion.div
        {...fadeUp(0.1)}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
      >
        <Sparkles className="size-3.5" />
        AI-Powered Travel Planning
      </motion.div>

      {/* Headline */}
      <motion.h1
        {...fadeUp(0.2)}
        className="text-balance text-5xl font-bold leading-[1.1] tracking-tight text-white dark:text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
      >
        Your next adventure,
        <br />
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          reimagined by AI
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        {...fadeUp(0.3)}
        className="mt-6 max-w-2xl text-balance text-base text-white/80 dark:text-muted-foreground sm:text-lg"
      >
        Tell us where you dream of going, and let AI craft the perfect
        itinerary — from hidden gems to local favorites, all in seconds.
      </motion.p>

      {/* Prompt Input */}
      <motion.div
        {...fadeUp(0.35)}
        className="mt-10 w-full"
      >
        <PromptInput />
      </motion.div>
    </div>
  );
}
