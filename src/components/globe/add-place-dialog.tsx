"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, MapPin, Loader2 } from "lucide-react";
import { searchCities, type City } from "@/data/cities";

interface AddPlaceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, lat: number, lng: number, photo: string | null) => Promise<void>;
  initialLat?: number;
  initialLng?: number;
}

export function AddPlaceDialog({ open, onClose, onAdd, initialLat, initialLng }: AddPlaceDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customName, setCustomName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isDirectMode = initialLat !== undefined && initialLng !== undefined;

  // Reset state when dialog opens
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setSelected(null);
    setPhoto(null);
    setCustomName("");
    setLoading(false);
  }, [open]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(searchCities(q));
  };

  const handleSelect = (city: City) => {
    setSelected(city);
    setQuery(city.name);
    setResults([]);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (isDirectMode) {
      if (!customName.trim()) return;
      setLoading(true);
      await onAdd(customName.trim(), initialLat!, initialLng!, photo);
    } else {
      if (!selected) return;
      setLoading(true);
      await onAdd(selected.name, selected.lat, selected.lng, photo);
    }
    setLoading(false);
    onClose();
  };

  const canSubmit = isDirectMode ? customName.trim().length > 0 : selected !== null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm rounded-2xl border border-border/40 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
              <h2 className="text-base font-semibold">添加足迹</h2>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              {isDirectMode ? (
                <>
                  {/* Direct mode: show coords + name input */}
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-sm">
                    <MapPin className="size-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {initialLat!.toFixed(4)}, {initialLng!.toFixed(4)}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="输入地点名称..."
                    className="w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                    autoFocus
                  />
                </>
              ) : (
                <>
                  {/* Search mode */}
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="搜索城市..."
                      className="w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                    />
                  </div>

                  {results.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border/20 bg-background">
                      {results.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleSelect(city)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                        >
                          <MapPin className="size-3.5 shrink-0 text-primary/60" />
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {selected && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-sm">
                      <MapPin className="size-4 text-primary" />
                      <span className="font-medium">{selected.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({selected.lat.toFixed(2)}, {selected.lng.toFixed(2)})
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Photo upload */}
              <div className="mt-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
                {photo ? (
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Upload className="size-4" />
                    上传照片（可选）
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-border/20 px-5 py-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border/30 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "确认添加"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
