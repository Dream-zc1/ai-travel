"use client";

import { motion } from "framer-motion";
import { MessageSquareHeart } from "lucide-react";
import { ExperiencesCarousel } from "./experiences-carousel";

export function Experiences() {
  return (
    <section id="reviews" className="scroll-mt-24 py-24 pb-32 sm:py-32 sm:pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
        >
          <MessageSquareHeart className="size-3.5" />
          游客返图
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          旅行者的真实分享
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          来自全球旅行者的真实反馈 — 看看AI规划的行程如何让他们的旅途更加精彩。
        </motion.p>
      </div>

      {/* Full-bleed carousel */}
      <div className="mt-12">
        <ExperiencesCarousel />
      </div>
    </section>
  );
}
