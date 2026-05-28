"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send, Loader2, Plus, User } from "lucide-react";
import { createPortal } from "react-dom";

interface Checkin {
  id: number;
  userId: string;
  placeName: string;
  comment: string | null;
  imageUrl: string | null;
  createdAt: string;
  userName: string | null;
  userAvatar: string | null;
}

interface CheckinListProps {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  placeName: string;
}

export function CheckinList({ open, onClose, lat, lng, placeName }: CheckinListProps) {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCheckins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/checkins?lat=${lat}&lng=${lng}&radius_km=1`);
      if (res.ok) setCheckins(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setComment("");
      setSelectedFile(null);
      setImagePreview(null);
      fetchCheckins();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return; // max 2MB for base64 storage
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim() && !selectedFile) return;
    setSubmitting(true);

    // Convert image to base64 on client-side (works on any platform)
    let imageUrl: string | null = null;
    if (selectedFile) {
      try {
        imageUrl = await fileToBase64(selectedFile);
      } catch {}
    }

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName,
          lat,
          lng,
          comment: comment.trim() || null,
          imageUrl,
        }),
      });
      if (res.ok) {
        setComment("");
        handleRemoveImage();
        await fetchCheckins();
      }
    } catch {}
    setSubmitting(false);
  };

  const previewPortal = previewImage
    ? createPortal(
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
      )
    : null;

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="flex h-[70vh] w-full max-w-md flex-col rounded-2xl border border-border/40 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">每个人的热爱</h2>
                <p className="text-xs text-muted-foreground">{placeName}</p>
              </div>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : checkins.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="mx-auto size-8 text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground/60">
                      还没有人在这里打卡
                    </p>
                    <p className="text-xs text-muted-foreground/40">
                      来写下第一条留言吧
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {checkins.map((c) => (
                    <div
                      key={c.id}
                      className="flex gap-3 rounded-xl border border-border/20 bg-muted/20 p-3"
                    >
                      {/* Left: avatar + name */}
                      <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 pt-1">
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-border/30 bg-muted/40">
                          {c.userAvatar ? (
                            <img src={c.userAvatar} alt="" className="size-full object-cover" />
                          ) : (
                            <User className="size-5 text-muted-foreground/50" />
                          )}
                        </div>
                        <span className="max-w-full truncate text-[11px] text-muted-foreground">
                          {c.userName || "匿名用户"}
                        </span>
                      </div>

                      {/* Right: image + comment */}
                      <div className="min-w-0 flex-1">
                        {c.imageUrl && (
                          <img
                            src={c.imageUrl}
                            alt=""
                            className="mb-1.5 w-full cursor-pointer rounded-lg object-cover"
                            onDoubleClick={() => setPreviewImage(c.imageUrl)}
                          />
                        )}
                        {c.comment && (
                          <p className="text-sm leading-relaxed">{c.comment}</p>
                        )}
                        <p className="mt-1 text-[11px] text-muted-foreground/40">
                          {new Date(c.createdAt).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="relative mx-5 border-t border-border/20 pt-3">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow transition-opacity hover:opacity-80"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-border/20 px-5 py-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Plus className="size-4" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="留下你的留言..."
                className="flex-1 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              />
              <button
                onClick={handleSubmit}
                disabled={(!comment.trim() && !selectedFile) || submitting}
                className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {previewPortal}
    </>
  );
}
