"use client";

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";
import { enhancePrompt } from "@/lib/ai/prompt-enhancer";
import type { Itinerary } from "@/lib/ai/schema";

const STORAGE_KEY = "ai-travel-itinerary";

interface PlannerContextValue {
  itinerary: Itinerary | null;
  generationStep: number;
  input: string;
  currentQuery: string;
  history: Itinerary[];
  historyQueries: string[];
  selectHistory: (index: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: Error | undefined;
  reload: () => void;
  stop: () => void;
  setInput: (value: string) => void;
  append: (message: { role: "user"; content: string }) => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [input, setInput] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [history, setHistory] = useState<Itinerary[]>([]);
  const [historyQueries, setHistoryQueries] = useState<string[]>([]);

  // Restore saved itinerary on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Itinerary;
        if (parsed.title && parsed.days) {
          setItinerary(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-save to localStorage when itinerary completes
  useEffect(() => {
    if (itinerary && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    }
  }, [itinerary, isLoading]);

  const abortRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef("");

  const selectHistory = (index: number) => {
    setItinerary(history[index]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    append({ role: "user", content: input.trim() });
  };

  const stop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const append = async (message: { role: "user"; content: string }) => {
    // If there's an existing itinerary, treat as a follow-up refinement
    const isRefinement = !!itinerary && !isLoading;

    let prompt: string;
    if (isRefinement) {
      // Save current to history before updating
      setHistory((prev) => [...prev, itinerary!]);
      setHistoryQueries((prev) => [...prev, currentQuery]);
      prompt = `I already have this itinerary:\n${JSON.stringify(itinerary, null, 2)}\n\nNow I want to refine it: ${message.content}\n\nOutput the FULL updated itinerary as valid JSON. Keep the same JSON structure.`;
      setCurrentQuery(message.content);
    } else {
      prompt = enhancePrompt(message.content);
      setCurrentQuery(message.content);
    }

    console.log("Prompt:", prompt);
    lastPromptRef.current = prompt;
    setGenerationStep(0);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let chunkIndex = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Advance reasoning step every 2 chunks
        chunkIndex++;
        setGenerationStep(Math.min(Math.floor(chunkIndex / 2), 5));

        // Try to parse partial JSON — UI updates incrementally as data streams in
        try {
          const partial = JSON.parse(buffer) as Itinerary;
          setItinerary(partial);
        } catch {
          // Not yet valid JSON, wait for more data
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err : new Error("Something went wrong"));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const reload = () => {
    if (!lastPromptRef.current) return;
    append({ role: "user", content: lastPromptRef.current });
  };

  return (
    <PlannerContext.Provider
      value={{
        itinerary,
        generationStep,
        input,
        currentQuery,
        history,
        historyQueries,
        selectHistory,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        reload,
        stop,
        setInput,
        append,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlannerContext() {
  const ctx = useContext(PlannerContext);
  if (!ctx) {
    throw new Error("usePlannerContext must be used within PlannerProvider");
  }
  return ctx;
}
