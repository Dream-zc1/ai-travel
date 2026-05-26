"use client";

import { motion } from "framer-motion";
import { Hotel, Wallet } from "lucide-react";
import type { DayPlan } from "./planner-data";

interface TimelineDayCardProps {
  day: DayPlan;
  index: number;
}

export function TimelineDayCard({ day, index }: TimelineDayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0, 1],
      }}
      className="relative mb-10 pl-10 last:mb-0"
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          delay: index * 0.15 + 0.1,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="absolute left-[5px] top-6 size-3.5 rounded-full border-2 border-primary bg-background"
      />

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-colors hover:border-border/60 hover:shadow-md"
      >
        {/* Day header */}
        <div className="mb-4 flex items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Day {day.dayNumber}
          </span>
          <h4 className="text-base font-semibold tracking-tight">
            {day.title}
          </h4>
        </div>

        {/* Activities */}
        {day.activities.length > 0 && (
          <ul className="space-y-0">
            {day.activities.map((act, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border-b border-border/10 py-2.5 last:border-0"
              >
                <span className="min-w-[3rem] text-xs font-medium text-muted-foreground">
                  {act.time}
                </span>
                <div>
                  <span className="text-sm font-medium">{act.title}</span>
                  {act.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {act.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Hotel + Budget */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border/20 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Hotel className="size-3.5" />
            {day.hotel}
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="size-3.5" />
            {day.budgetEstimate}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
