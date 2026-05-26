"use client";

import type { DayPlan } from "./planner-data";
import { TimelineDayCard } from "./timeline-day-card";

interface TimelineProps {
  days: DayPlan[];
}

export function Timeline({ days }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[13px] top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

      {/* Day cards */}
      {days.map((day, i) => (
        <TimelineDayCard key={day.dayNumber} day={day} index={i} />
      ))}
    </div>
  );
}
