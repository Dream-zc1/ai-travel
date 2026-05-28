"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, User, Check, ChevronsUpDown } from "lucide-react";
import { chineseCities } from "@/data/chinese-cities";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onProfileUpdate?: (data: { name?: string | null; bio?: string | null; avatar?: string | null; region?: string | null; location?: string | null }) => void;
}

// Unique city names sorted
const cityOptions = [
  ...new Set(chineseCities.map((c) => c.name)),
].sort();

export function ProfileModal({ open, onClose, onProfileUpdate }: ProfileModalProps) {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [region, setRegion] = useState(user?.region || "");
  const [location, setLocation] = useState(user?.location || "");
  const [saving, setSaving] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [ipLocating, setIpLocating] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setAvatarDataUrl(null);
      setAvatarFile(null);
      // Fetch latest profile from DB (avatar saved there even if JWT not updated)
      fetch("/api/user/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.avatar) setAvatarDataUrl(data.avatar);
        })
        .catch(() => {});
    }
  }, [open]);

  // Sync from session — only overwrite avatar if user didn't pick a new file
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatarDataUrl((prev) => (prev === null ? user.avatar || null : prev));
      setRegion(user.region || "");
      setLocation(user.location || "");
    }
  }, [user]);

  // Auto-detect location from IP on first open
  useEffect(() => {
    if (open && !user?.location && !location && !ipLocating) {
      setIpLocating(true);
      fetch("http://ip-api.com/json/?fields=city")
        .then((r) => r.json())
        .then((d) => {
          if (d.city) setLocation(d.city);
        })
        .catch(() => {})
        .finally(() => setIpLocating(false));
    }
  }, [open]);

  // Close region dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const filteredCities = useMemo(
    () =>
      regionSearch
        ? cityOptions.filter((c) => c.includes(regionSearch))
        : cityOptions,
    [regionSearch],
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim() || null,
        bio: bio.trim() || null,
        region: region || null,
        location: location || null,
      };

      // Only send avatar when user actually selected a new file
      if (avatarFile) {
        body.avatar = avatarDataUrl;
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated = await res.json();
        // Notify parent with new profile data (including avatar for immediate UI update)
        onProfileUpdate?.(updated);
        // Clear avatar from JWT — prevents cookie >4KB limit. Navbar/profile fetch from DB.
        const { avatar: _, ...sessionData } = updated;
        await update({ ...sessionData, avatar: null });
        onClose();
      }
    } catch {}
    setSaving(false);
  };

  const displayAvatar = avatarDataUrl || user?.avatar || null;

  return createPortal(
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="flex w-full max-w-sm flex-col rounded-2xl border border-border/40 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
              <h2 className="text-base font-semibold">个人资料</h2>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 overflow-y-auto px-5 py-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-border/30 bg-muted/30">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="avatar"
                        className="size-full cursor-pointer object-cover"
                        onDoubleClick={() => setPreviewAvatar(true)}
                      />
                    ) : (
                      <User className="size-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border/30 bg-background shadow transition-colors hover:bg-muted"
                  >
                    <Camera className="size-3.5 text-muted-foreground" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <span className="text-xs text-muted-foreground">点击更换头像</span>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">昵称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入昵称"
                  className="w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">个性签名</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="写一句个性签名..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
              </div>

              {/* Region — searchable select */}
              <div ref={regionRef} className="relative">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">居住地区</label>
                <button
                  type="button"
                  onClick={() => setRegionOpen(!regionOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                >
                  <span className={region ? "" : "text-muted-foreground/50"}>
                    {region || "选择城市"}
                  </span>
                  <ChevronsUpDown className="size-4 text-muted-foreground/50" />
                </button>
                {regionOpen && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border/40 bg-background shadow-lg">
                    <input
                      type="text"
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      placeholder="搜索城市..."
                      className="sticky top-0 w-full border-b border-border/20 bg-background px-3 py-2 text-xs outline-none"
                      autoFocus
                    />
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setRegion(city);
                          setRegionOpen(false);
                          setRegionSearch("");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                      >
                        <span className={city === region ? "text-primary" : ""}>{city}</span>
                        {city === region && <Check className="ml-auto size-3.5 text-primary" />}
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <p className="px-3 py-3 text-xs text-muted-foreground/50">无匹配结果</p>
                    )}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">所在地区</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={ipLocating ? "正在定位..." : "输入当前位置"}
                    className="w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                  />
                  {ipLocating && (
                    <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground/50" />
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border/20 px-5 py-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-border/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Full-size avatar preview on double-click */}
      {previewAvatar && displayAvatar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewAvatar(false)}
        >
          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={displayAvatar}
            alt="avatar"
            className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>,
    document.body,
  );
}
