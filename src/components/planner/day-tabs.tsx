"use client";

import { motion } from "framer-motion";

type Props = {
  days: number[];
  activeDay: number;
  onChange: (day: number) => void;
};

export function DayTabs({ days, activeDay, onChange }: Props) {
  return (
    <div className="sticky top-24 z-20 mb-8 flex gap-3 overflow-x-auto pb-2">
      {days.map((day) => {
        const active = activeDay === day;

        return (
          <motion.button
            key={day}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(day)}
            className={`
              relative whitespace-nowrap rounded-full
              border px-5 py-2.5 text-sm font-medium
              backdrop-blur-xl transition-all duration-300
              ${
                active
                  ? `
                    border-primary/40
                    bg-primary/15
                    text-white
                    shadow-[0_0_30px_rgba(99,102,241,0.35)]
                  `
                  : `
                    border-white/10
                    bg-white/5
                    text-foreground/70
                    hover:border-primary/20
                    hover:bg-primary/10
                    hover:text-white
                  `
              }
            `}
          >
            {active && (
              <motion.div
                layoutId="active-day-pill"
                className="absolute inset-0 rounded-full bg-primary/10"
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
              />
            )}

            <span className="relative z-10">Day {day}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
