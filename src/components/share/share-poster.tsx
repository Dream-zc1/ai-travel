"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";

interface SharePosterProps {
  open: boolean;
  onClose: () => void;
  globeCanvas: HTMLCanvasElement | null;
  cityCount: number;
  countryCount: number;
  totalKm: number;
}

export function SharePoster({ open, onClose, globeCanvas, cityCount, countryCount, totalKm }: SharePosterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!open || !globeCanvas) return;
    setGenerating(true);

    const poster = canvasRef.current;
    if (!poster) return;
    const ctx = poster.getContext("2d");
    if (!ctx) return;

    const W = 800;
    const H = 600;
    poster.width = W;
    poster.height = H;

    // Wait a frame for the canvas to be ready
    requestAnimationFrame(() => {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0a1628");
      grad.addColorStop(0.5, "#0f1f3d");
      grad.addColorStop(1, "#0a1628");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Draw globe screenshot
      if (globeCanvas) {
        const gw = globeCanvas.width;
        const gh = globeCanvas.height;
        const size = Math.min(gw, gh);
        const sx = (gw - size) / 2;
        const sy = (gh - size) / 2;
        ctx.drawImage(globeCanvas, sx, sy, size, size, 30, 30, W - 60, W - 60);
      }

      // Top decorative line
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 20);
      ctx.lineTo(W - 40, 20);
      ctx.stroke();

      // Bottom decorative line
      ctx.beginPath();
      ctx.moveTo(40, H - 20);
      ctx.lineTo(W - 40, H - 20);
      ctx.stroke();

      // Stats overlay at bottom — each stat stacked vertically
      const statsData = [
        { value: String(cityCount), label: "城市" },
        { value: String(countryCount), label: "国家" },
        { value: totalKm.toLocaleString("zh-CN"), label: "km" },
      ];
      const statY = H - 110;
      const statSpacing = 150;
      const totalWidth = statsData.length * statSpacing;
      const startX = (W - totalWidth) / 2 + statSpacing / 2;

      statsData.forEach((stat, i) => {
        const cx = startX + i * statSpacing;

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.font = "bold 40px -apple-system, 'PingFang SC', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(stat.value, cx, statY - 18);

        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "16px -apple-system, 'PingFang SC', sans-serif";
        ctx.fillText(stat.label, cx, statY + 22);

        // Separator
        if (i < statsData.length - 1) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.font = "24px sans-serif";
          ctx.fillText("|", cx + statSpacing / 2, statY - 6);
        }
      });

      // Title
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "18px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("我的旅行足迹", W / 2, H - 170);

      setGenerating(false);
    });
  }, [open, globeCanvas, cityCount, countryCount, totalKm]);

  const handleDownload = () => {
    const poster = canvasRef.current;
    if (!poster) return;
    const link = document.createElement("a");
    link.download = `travel-map-${Date.now()}.png`;
    link.href = poster.toDataURL("image/png");
    link.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full items-center justify-between">
              <h2 className="text-base font-semibold">旅行地图海报</h2>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border/20">
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="max-h-[60vh] max-w-full"
                style={{ width: 400, height: 300 }}
              />
            </div>

            <button
              onClick={handleDownload}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Download className="size-4" />
              下载海报
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
