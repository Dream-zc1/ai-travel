"use client";

import { motion } from "framer-motion";
import { X, Trash2, MapPin, Camera } from "lucide-react";

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  photo: string | null;
}

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export function PlaceDetail({ place, onClose, onDelete }: PlaceDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-border/40 bg-background/80 shadow-xl backdrop-blur-xl"
    >
      {/* Photo */}
      {place.photo ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={place.photo}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/5 to-primary/10">
          <Camera className="size-10 text-primary/30" />
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <h3 className="text-base font-semibold">{place.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(place.id)}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
        </p>
      </div>
    </motion.div>
  );
}
