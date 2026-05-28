"use client";

import { motion } from "framer-motion";
import { WandSparkles, ArrowDown, LockKeyhole, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OutputPanel } from "./output-panel";
import { Button } from "@/components/ui/button";

export function Planner() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <>
      {/* Bridge section — connects inspiration to AI generation */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center py-16"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="-mt-3 flex items-center gap-2 rounded-full border border-primary/10 bg-background/60 px-5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              <ArrowDown className="size-3 text-primary/60" />
              Got inspired? Let AI build your itinerary
              <ArrowDown className="size-3 text-primary/60" />
            </div>
          </motion.div>
        </div>
      </div>

      <section id="planner-section" className="scroll-mt-24 bg-gradient-to-b from-background via-primary/[0.02] to-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
          >
            <WandSparkles className="size-3.5" />
            AI Travel Planner
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            See it in action
          </motion.h2>

          {/* Output */}
          <div className="mt-12 min-h-[60vh]">
            {isAuthenticated ? (
              <OutputPanel />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-b from-background via-primary/[0.02] to-background px-6 py-20 text-center"
              >
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-primary/5">
                  <LockKeyhole className="size-7 text-primary/60" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  登录后使用完整功能
                </h3>
                <p className="mt-2 max-w-sm text-balance text-sm text-muted-foreground">
                  登录即可使用 AI 行程规划器，生成专属你的旅行路线。
                </p>
                <Link href="/login">
                  <Button className="mt-8 h-11 rounded-full px-6 text-sm font-medium">
                    <LogIn className="mr-1.5 size-4" />
                    立即登录
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
