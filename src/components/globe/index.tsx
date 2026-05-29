"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Globe2, Plus, LockKeyhole, LogIn, MapPin, Share2, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GlobeView = dynamic(() => import("./globe-view").then((m) => m.GlobeView), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center sm:h-[700px] lg:h-[800px]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full border border-border/40 bg-muted/30">
          <Globe2 className="size-7 animate-pulse text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground/60">加载地球中...</p>
      </div>
    </div>
  ),
});
import { PlaceDetail } from "./place-detail";
import { AddPlaceDialog } from "./add-place-dialog";
import { ChinaMapDetail } from "./china-map-detail";
import { Button } from "@/components/ui/button";
import { computeStats, type TravelStats } from "@/lib/travel-stats";
import { SharePoster } from "@/components/share/share-poster";
import { Timeline } from "./timeline";

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  photo: string | null;
}

export function MyGlobe() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLat, setDialogLat] = useState<number | undefined>();
  const [dialogLng, setDialogLng] = useState<number | undefined>();
  const [showChinaMap, setShowChinaMap] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [stats, setStats] = useState<TravelStats>({ cityCount: 0, countryCount: 0, totalKm: 0 });
  const [showShare, setShowShare] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [globeCanvas, setGlobeCanvas] = useState<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver — only load Three.js when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlobeVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fetchPlaces = useCallback(async () => {
    if (!isAuthenticated) return;
    const [placesRes, checkinsRes] = await Promise.all([
      fetch("/api/places"),
      fetch("/api/checkins/my"),
    ]);
    let all: { lat: number; lng: number }[] = [];
    if (placesRes.ok) {
      const data = await placesRes.json();
      setPlaces(data);
      all = data;
    }
    if (checkinsRes.ok) {
      const data = await checkinsRes.json();
      all = [...all, ...data];
    }
    setStats(computeStats(all));
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleAdd = async (
    name: string,
    lat: number,
    lng: number,
    photo: string | null,
  ) => {
    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lat, lng, photo }),
    });
    if (res.ok) {
      await fetchPlaces();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlaces((prev) => prev.filter((p) => p.id !== id));
      setSelected(null);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="globe-section"
      className="scroll-mt-24 bg-gradient-to-b from-background via-primary/[0.02] to-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary"
        >
          <Globe2 className="size-3.5" />
          我的足迹
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          点亮你去过的世界
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          在地球上标记你去过的每一个地方，上传照片，留住旅行记忆。
        </motion.p>

        {/* Content */}
        <div className="relative mt-12">
          {isAuthenticated ? (
            <>
              <div className="relative -ml-[5%] w-[110%] sm:-ml-[8%] sm:w-[116%] lg:-ml-[12%] lg:w-[124%]">
                {globeVisible ? (
                  <GlobeView
                    places={places}
                    onPlaceClick={(p) => setSelected(p)}
                    onCountryClick={() => setShowChinaMap(true)}
                    onGlobeDoubleClick={(lat, lng) => {
                      setDialogLat(lat);
                      setDialogLng(lng);
                      setDialogOpen(true);
                    }}
                    onCanvasReady={(canvas) => setGlobeCanvas(canvas)}
                  />
                ) : (
                  <div className="flex h-[600px] w-full items-center justify-center sm:h-[700px] lg:h-[800px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full border border-border/30 bg-muted/20">
                        <Globe2 className="size-6 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs text-muted-foreground/40">滚动到此处加载地球</p>
                    </div>
                  </div>
                )}

                {/* Bottom-right buttons group */}
                <div className="absolute bottom-4 right-4 z-10 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setDialogLat(undefined);
                      setDialogLng(undefined);
                      setDialogOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/40"
                  >
                    <Plus className="size-4" />
                    添加足迹
                  </button>

                  {globeCanvas && stats.cityCount > 0 && (
                    <button
                      onClick={() => setShowShare(true)}
                      className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/80 px-4 py-2.5 text-sm font-medium text-primary shadow-lg backdrop-blur-md transition-all hover:bg-background hover:shadow-xl"
                    >
                      <Share2 className="size-4" />
                      分享
                    </button>
                  )}

                  {stats.cityCount > 0 && (
                    <button
                      onClick={() => setShowTimeline(true)}
                      className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-background/80 px-4 py-2.5 text-sm font-medium text-emerald-600 shadow-lg backdrop-blur-md transition-all hover:bg-background hover:shadow-xl dark:text-emerald-400"
                    >
                      <MessageCircle className="size-4" />
                      日记
                    </button>
                  )}
                </div>

                {/* Place count */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
                  <MapPin className="size-3.5 text-primary/60" />
                  <span>
                    已点亮 <strong className="text-foreground">{stats.cityCount}</strong> 个地方
                  </span>
                </div>

                {/* Travel stats */}
                {stats.cityCount > 0 && (
                  <div className="absolute left-4 top-16 z-10 flex items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/15 to-primary/5 px-4 py-2.5 text-primary shadow-lg shadow-primary/10 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-0">
                      <span className="text-sm font-bold leading-tight">{stats.cityCount}</span>
                      <span className="text-[10px] leading-tight text-primary/60">城市</span>
                    </div>
                    <span className="text-[10px] text-primary/20">|</span>
                    <div className="flex flex-col items-center gap-0">
                      <span className="text-sm font-bold leading-tight">{stats.countryCount}</span>
                      <span className="text-[10px] leading-tight text-primary/60">国家</span>
                    </div>
                    <span className="text-[10px] text-primary/20">|</span>
                    <div className="flex flex-col items-center gap-0">
                      <span className="text-sm font-bold leading-tight">{stats.totalKm.toLocaleString("zh-CN")}</span>
                      <span className="text-[10px] leading-tight text-primary/60">km</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected place detail */}
              {selected && (
                <div className="absolute bottom-20 right-4 z-10 w-64 sm:bottom-24 sm:right-6">
                  <PlaceDetail
                    place={selected}
                    onClose={() => setSelected(null)}
                    onDelete={handleDelete}
                  />
                </div>
              )}

              {/* Add dialog */}
              <AddPlaceDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdd={handleAdd}
                initialLat={dialogLat}
                initialLng={dialogLng}
              />

              {/* China detail map */}
              <ChinaMapDetail
                open={showChinaMap}
                onClose={() => { setShowChinaMap(false); fetchPlaces(); }}
                places={places}
              />

              <SharePoster
                open={showShare}
                onClose={() => setShowShare(false)}
                globeCanvas={globeCanvas}
                cityCount={stats.cityCount}
                countryCount={stats.countryCount}
                totalKm={stats.totalKm}
              />

              <Timeline
                open={showTimeline}
                onClose={() => setShowTimeline(false)}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
              className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-b from-background via-primary/[0.02] to-background px-6 py-20 text-center"
            >
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-primary/5">
                <Globe2 className="size-7 text-primary/60" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                登录后查看你的世界足迹
              </h3>
              <p className="mt-2 max-w-sm text-balance text-sm text-muted-foreground">
                登录即可在地球上标记你去过的地方，点亮你的旅行地图。
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
  );
}
