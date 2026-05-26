"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Send, Loader2 } from "lucide-react";

import type { Itinerary } from "@/lib/ai/schema";
import { DayTabs } from "./day-tabs";
import { usePlannerContext } from "./planner-context";

function itineraryToMarkdown(it: Itinerary): string {
  const lines: string[] = [];
  lines.push(`# ${it.title}\n`);
  lines.push(`${it.overview}\n`);
  lines.push(`---\n`);
  for (const day of it.days) {
    lines.push(`## Day ${day.day} — ${day.title}\n`);
    if (day.morning?.length) {
      lines.push(`### 🌅 Morning\n${day.morning.map((a) => `- ${a}`).join("\n")}\n`);
    }
    if (day.afternoon?.length) {
      lines.push(`### ☀️ Afternoon\n${day.afternoon.map((a) => `- ${a}`).join("\n")}\n`);
    }
    if (day.evening?.length) {
      lines.push(`### 🌙 Evening\n${day.evening.map((a) => `- ${a}`).join("\n")}\n`);
    }
    if (day.food?.length) {
      lines.push(`### 🍽️ Food\n${day.food.map((a) => `- ${a}`).join("\n")}\n`);
    }
    lines.push(`- **Hotel:** ${day.hotel}`);
    lines.push(`- **Transport:** ${day.transportation}\n`);
  }
  return lines.join("\n");
}

const RouteMap = dynamic(() => import("./route-map").then((m) => m.RouteMap), {
  ssr: false,
});

type Props = {
  itinerary: Itinerary;
};

export function ItineraryTimeline({ itinerary }: Props) {
  const [activeDay, setActiveDay] = useState(itinerary.days[0]?.day ?? 1);
  const [refineInput, setRefineInput] = useState("");
  const dayNumbers = itinerary.days.map((d) => d.day);
  const { append, isLoading } = usePlannerContext();

  const handleRefine = () => {
    const text = refineInput.trim();
    if (!text || isLoading) return;
    setRefineInput("");
    append({ role: "user", content: text });
  };

  const handleDownload = useCallback(() => {
    const md = itineraryToMarkdown(itinerary);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${itinerary.title.replace(/[^a-zA-Z0-9一-鿿]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [itinerary]);

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {itinerary.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{itinerary.overview}</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="mt-1 flex shrink-0 items-center gap-1.5 rounded-full border border-border/30 px-3.5 py-2 text-xs text-muted-foreground/70 transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <Download className="size-3.5" />
          Export
        </button>
      </div>

      <DayTabs days={dayNumbers} activeDay={activeDay} onChange={setActiveDay} />

      {/* Route map for active day */}
      {itinerary.days
        .filter((d) => d.day === activeDay)
        .map((d) =>
          d.route?.length ? (
            <RouteMap
              key={`map-${d.day}`}
              route={d.route}
              title={`Day ${d.day} Route`}
            />
          ) : null,
        )}

      <AnimatePresence mode="wait">
        {itinerary.days
          .filter((day) => day.day === activeDay)
          .map((day) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  Day {day.day} — {day.title}
                </h3>

                <div className="mt-6 space-y-6">
                  {/* Morning */}
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Morning
                    </h4>
                    <ul className="space-y-1.5">
                      {day.morning.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground/80 before:mr-2 before:text-amber-400/60 before:content-['▸']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Afternoon */}
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                      Afternoon
                    </h4>
                    <ul className="space-y-1.5">
                      {day.afternoon.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground/80 before:mr-2 before:text-sky-400/60 before:content-['▸']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Evening */}
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                      Evening
                    </h4>
                    <ul className="space-y-1.5">
                      {day.evening.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground/80 before:mr-2 before:text-purple-400/60 before:content-['▸']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Food */}
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                      Food
                    </h4>
                    <ul className="space-y-1.5">
                      {day.food.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground/80 before:mr-2 before:text-foreground/40 before:content-['●']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Hotel + Transportation */}
                  <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-sm text-foreground/60">
                    <div>
                      <span className="font-medium text-foreground/80">Hotel:</span>{" "}
                      {day.hotel}
                    </div>
                    <div>
                      <span className="font-medium text-foreground/80">Transport:</span>{" "}
                      {day.transportation}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Refine input */}
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-white/[0.02] px-4 py-3">
        <input
          type="text"
          value={refineInput}
          onChange={(e) => setRefineInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRefine()}
          placeholder={'Refine this itinerary... (e.g. "add a ramen spot to day 2")'}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleRefine}
          disabled={!refineInput.trim() || isLoading}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-30"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
