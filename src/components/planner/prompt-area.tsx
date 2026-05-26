"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, WandSparkles, Loader2, Square } from "lucide-react";
import { usePlannerContext } from "./planner-context";
import { PROMPT_EXAMPLES } from "./prompt-examples";

export function PromptArea() {
  const {
    input,
    handleInputChange,
    isLoading,
    setInput,
    append,
    stop,
  } = usePlannerContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasPendingRequest = isLoading;

  const handleExampleClick = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const handleAppend = () => {
    if (!input.trim() || isLoading) return;
    append({ role: "user", content: input.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAppend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      className="flex flex-col"
    >
      <div
        className={`flex flex-1 flex-col rounded-2xl border bg-background/60 p-6 backdrop-blur-xl sm:p-8 ${
          hasPendingRequest
            ? "border-primary/20"
            : "animate-glow-pulse border-primary/10"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-foreground/80">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <WandSparkles className="size-4 text-primary" />
          </span>
          AI Travel Planner
        </div>

        {/* Prompt chips */}
        {!hasPendingRequest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {PROMPT_EXAMPLES.map((example) => (
              <motion.button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="
                  rounded-full
                  border border-white/10
                  bg-white/5
                  px-4 py-2
                  text-xs
                  text-foreground/80
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-primary/30
                  hover:bg-primary/10
                  hover:text-white
                "
              >
                ✦ {example}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input area */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your dream trip..."
            rows={3}
            disabled={hasPendingRequest}
            className="w-full resize-none bg-transparent text-lg leading-relaxed text-foreground/90 placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50 sm:text-xl"
          />
        </div>

        {/* Controls */}
        <div className="mt-auto flex items-center gap-3">
          {hasPendingRequest ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-background/40 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/60"
            >
              <Square className="size-4 fill-current" />
              Stop generating
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAppend}
              disabled={!input.trim()}
              className="group inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-primary to-primary/60 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-40 disabled:hover:shadow-lg"
            >
              <Sparkles className="size-4" />
              Generate my trip
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          )}

          {hasPendingRequest && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Generating...
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
