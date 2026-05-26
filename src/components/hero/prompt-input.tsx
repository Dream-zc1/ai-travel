"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlannerContext } from "@/components/planner/planner-context";

export function PromptInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const { append, isLoading } = usePlannerContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasClicked = useRef(false);

  // Scroll to planner section when loading starts
  useEffect(() => {
    if (isLoading && hasClicked.current) {
      const el = document.getElementById("planner-section");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
      }
    }
    if (!isLoading) {
      hasClicked.current = false;
    }
  }, [isLoading]);

  const handleSubmit = () => {
    const text = value.trim();
    if (!text || isLoading) return;
    hasClicked.current = true;
    append({ role: "user", content: text });
  };

  return (
    <div
      className={cn(
        "group relative mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border px-4 py-3 transition-all duration-300",
        "bg-background/60 backdrop-blur-xl",
        focused
          ? "border-primary/50 shadow-[0_0_30px_-8px_hsl(var(--primary))]"
          : "border-border/50 hover:border-border/80",
        isLoading && "border-primary/30",
      )}
    >
      <Sparkles
        className={cn(
          "size-5 shrink-0 transition-colors duration-300",
          isLoading
            ? "animate-pulse text-primary"
            : focused
              ? "text-primary"
              : "text-muted-foreground",
        )}
      />
      {isLoading ? (
        <div className="flex-1 text-left text-sm text-muted-foreground">
          <span className="animate-pulse">Generating your itinerary...</span>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Where do you want to go?"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
        />
      )}
      <button
        onClick={isLoading ? undefined : handleSubmit}
        disabled={!isLoading && (!value.trim() || isLoading)}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
          focused && !isLoading
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
          "disabled:opacity-40",
        )}
        aria-label="Generate itinerary"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
      </button>
    </div>
  );
}
