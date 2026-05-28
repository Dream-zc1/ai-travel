"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Settings, X } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileModal } from "@/components/profile/profile-modal";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-dismiss toast after 2s
  useEffect(() => {
    if (!toastOpen) return;
    const t = setTimeout(() => setToastOpen(false), 2000);
    return () => clearTimeout(t);
  }, [toastOpen]);

  // Fetch latest avatar from DB on mount (JWT may not have it)
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.avatar) setLocalAvatar(data.avatar);
        })
        .catch(() => {});
    }
  }, [session?.user]);

  const avatar = session?.user
    ? localAvatar || (session.user as any).avatar as string | undefined
    : undefined;

  if (status === "loading") {
    return (
      <div className="hidden h-8 w-20 animate-pulse rounded-full bg-primary/10 md:block" />
    );
  }

  return (
    <>
      {session?.user ? (
        <>
          <div className="relative hidden md:block" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-muted/30">
                {avatar ? (
                  <img src={avatar} alt="" className="size-full cursor-pointer object-cover" onDoubleClick={() => setPreviewAvatar(true)} />
                ) : (
                  <User className="size-4 text-muted-foreground/60" />
                )}
              </div>
              <span className="max-w-24 truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-border/30 bg-background shadow-lg">
                <button
                  onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  个人资料
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                >
                  <LogOut className="size-4 text-muted-foreground" />
                  退出登录
                </button>
              </div>
            )}
          </div>

          <ProfileModal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            onProfileUpdate={(data) => {
              if (data.avatar) setLocalAvatar(data.avatar);
              setToastOpen(true);
            }}
          />

          {previewAvatar && avatar && createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 p-4"
              onClick={() => setPreviewAvatar(false)}
            >
              <motion.img
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={avatar}
                alt="avatar"
                className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>,
            document.body,
          )}
        </>
      ) : (
        <Link
          href="/login"
          className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-block"
        >
          Login
        </Link>
      )}

      {toastOpen && createPortal(
        <div
          className="fixed left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 rounded-xl border border-border/40 bg-background px-5 py-3 shadow-2xl animate-pop-in transform-gpu"
        >
          <span className="text-sm font-medium">保存成功</span>
          <button
            onClick={() => setToastOpen(false)}
            className="flex size-5 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}
