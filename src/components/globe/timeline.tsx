"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, MessageCircle, Loader2, Camera } from "lucide-react";
import { createPortal } from "react-dom";

interface TimelineEntry {
  id: string;
  type: "place" | "checkin";
  name: string;
  lat: number;
  lng: number;
  photo: string | null;
  comment?: string | null;
  createdAt: string;
}

interface TimelineProps {
  open: boolean;
  onClose: () => void;
}

export function Timeline({ open, onClose }: TimelineProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    Promise.all([
      fetch("/api/places").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/checkins/my").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([places, checkins]) => {
        const mapped: TimelineEntry[] = [
          ...places.map((p: any) => ({
            id: `place-${p.id}`,
            type: "place" as const,
            name: p.name,
            lat: Number(p.lat),
            lng: Number(p.lng),
            photo: p.photo || null,
            comment: null,
            createdAt: p.createdAt,
          })),
          ...checkins.map((c: any) => ({
            id: `checkin-${c.id}`,
            type: "checkin" as const,
            name: c.placeName,
            lat: Number(c.lat),
            lng: Number(c.lng),
            photo: c.imageUrl || null,
            comment: c.comment || null,
            createdAt: c.createdAt,
          })),
        ];

        mapped.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setEntries(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="flex h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-border/40 bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">旅行日记</h2>
                  {!loading && (
                    <p className="text-xs text-muted-foreground">
                      共 {entries.length} 条记录
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Timeline */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-6"
              >
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : entries.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto size-8 text-muted-foreground/30" />
                      <p className="mt-2 text-sm text-muted-foreground/60">
                        还没有旅行记录
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative space-y-0">
                    {/* Vertical line */}
                    <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border/30" />

                    {entries.map((entry) => (
                      <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Dot */}
                        <div className="relative z-10 mt-1 flex shrink-0">
                          <div
                            className={`flex size-[34px] items-center justify-center rounded-full border-2 ${
                              entry.type === "place"
                                ? "border-primary/30 bg-primary/10"
                                : "border-emerald-400/30 bg-emerald-50 dark:bg-emerald-950/30"
                            }`}
                          >
                            {entry.type === "place" ? (
                              <MapPin className="size-4 text-primary" />
                            ) : (
                              <MessageCircle className="size-4 text-emerald-500" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">
                              {entry.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground/40">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>

                          {entry.photo && (
                            <img
                              src={entry.photo}
                              alt=""
                              className="mt-2 w-full cursor-pointer rounded-xl object-cover"
                              style={{ maxHeight: 200 }}
                              onDoubleClick={() => setPreviewImage(entry.photo)}
                            />
                          )}

                          {entry.comment && (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {entry.comment}
                            </p>
                          )}

                          {entry.type === "place" && !entry.photo && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/40">
                              <Camera className="size-3.5" />
                              未添加照片
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image preview */}
      {previewImage && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={previewImage}
            alt=""
            className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>,
        document.body,
      )}
    </>
  );
}
