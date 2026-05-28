"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Heart, Loader2 } from "lucide-react";

interface PlaceInfo {
  lat: number;
  lng: number;
  displayName: string;
  address?: string;
  wikipediaSummary?: string;
  wikipediaThumbnail?: string;
}

interface PlaceInfoCardProps {
  info: PlaceInfo | null;
  onClose: () => void;
  onShowCheckins: () => void;
  loading?: boolean;
}

export function PlaceInfoCard({ info, onClose, onShowCheckins, loading }: PlaceInfoCardProps) {
  return (
    <AnimatePresence>
      {info && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
          className="absolute right-4 top-4 z-[1000] w-72 overflow-hidden rounded-xl border border-border/40 bg-background/95 shadow-xl backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 px-4 pb-0 pt-4">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-semibold leading-tight">
                  {loading ? "加载中..." : info.displayName}
                </h3>
                {info.address && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{info.address}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Wikipedia photo & summary */}
          {loading ? (
            <div className="flex items-center justify-center px-4 py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {info.wikipediaThumbnail && (
                <div className="px-4 pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={info.wikipediaThumbnail}
                    alt={info.displayName}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                </div>
              )}
              {info.wikipediaSummary && (
                <p className="px-4 pb-3 pt-2 text-xs leading-relaxed text-muted-foreground">
                  {info.wikipediaSummary.length > 120
                    ? info.wikipediaSummary.slice(0, 120) + "..."
                    : info.wikipediaSummary}
                </p>
              )}

              {/* "看看每个人的热爱" button */}
              <button
                onClick={onShowCheckins}
                className="flex w-full items-center justify-center gap-1.5 border-t border-border/20 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                <Heart className="size-4" />
                看看每个人的热爱
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
