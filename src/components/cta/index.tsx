"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const avatars = [
  { initials: "JD", color: "from-blue-400 to-blue-600" },
  { initials: "SK", color: "from-purple-400 to-purple-600" },
  { initials: "AL", color: "from-amber-400 to-orange-600" },
  { initials: "MT", color: "from-emerald-400 to-teal-600" },
  { initials: "RY", color: "from-pink-400 to-rose-600" },
];

export function CTA() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          className="relative overflow-hidden rounded-3xl dark:bg-transparent bg-gradient-to-br from-primary/[0.06] via-background to-primary/[0.03]"
        >
          {/* Aurora blobs — dark mode only */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
          <div className="hidden dark:block animate-aurora-1 absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="hidden dark:block animate-aurora-2 absolute -bottom-40 right-10 size-[28rem] rounded-full bg-purple-500/15 blur-3xl" />
          <div className="hidden dark:block animate-aurora-3 absolute left-1/4 top-1/3 size-72 rounded-full bg-blue-500/15 blur-3xl" />

          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Dark overlay — dark mode only */}
          <div className="hidden dark:block absolute inset-0 bg-background/40" />

          {/* Light overlay — light mode only */}
          <div className="dark:hidden absolute inset-0 rounded-3xl ring-1 ring-primary/10" />

          {/* Border glow — dark mode */}
          <div className="hidden dark:block pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

          {/* Content */}
          <div className="relative z-10 px-6 py-20 text-center sm:px-16 sm:py-28 lg:px-24">
            {/* Avatar stack + count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mb-6 flex items-center justify-center gap-0"
            >
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className={`relative flex size-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br ${avatar.color} text-[10px] font-bold text-white shadow-sm`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              <div className="ml-4 flex items-center gap-1.5 text-left text-sm text-muted-foreground dark:text-white/60">
                <Users className="size-4 text-primary/60" />
                <span>
                  已有 <strong className="text-foreground dark:text-white">10,000+</strong> 位旅行者加入
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="text-balance text-4xl font-bold tracking-tight text-foreground dark:text-white sm:text-5xl lg:text-6xl"
            >
              加入我们，一起探索世界
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground dark:text-white/70 sm:text-lg"
            >
              用 AI 规划你的下一段旅程 — 从东京到巴黎，
              从摩洛哥到冰岛，你的专属行程已在路上。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-medium dark:bg-white dark:text-foreground dark:shadow-lg dark:shadow-white/20 dark:hover:bg-white/90 bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90"
                >
                  免费开始
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border/40 px-8 text-base font-medium text-foreground dark:border-white/20 dark:bg-white/5 dark:text-white dark:backdrop-blur-sm dark:hover:bg-white/10"
                >
                  了解更多
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
