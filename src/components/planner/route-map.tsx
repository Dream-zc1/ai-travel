"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Fix Leaflet default icon path (broken in bundled apps)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface RoutePoint {
  lat: number;
  lng: number;
  label: string;
}

type Props = {
  route: RoutePoint[];
  /** Title shown at the top of the map card */
  title?: string;
};

export function RouteMap({ route, title }: Props) {
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || route.length === 0) return;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    // 高德地图矢量瓦片（无需 Key）
    L.tileLayer(
      "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      {
        subdomains: ["1", "2", "3", "4"],
        maxZoom: 18,
        attribution: "&copy; 高德地图",
      },
    ).addTo(map);

    // Add markers
    route.forEach((point, i) => {
      const marker = L.marker([point.lat, point.lng]).addTo(map);
      marker.bindPopup(`<strong>${i + 1}.</strong> ${point.label}`);
    });

    // Draw route line
    const polyline = L.polyline(
      route.map((p) => [p.lat, p.lng] as [number, number]),
      {
        color: "#818cf8",
        weight: 2.5,
        opacity: 0.7,
        dashArray: "8, 8",
      },
    ).addTo(map);

    // Fit bounds with padding
    if (route.length === 1) {
      map.setView([route[0].lat, route[0].lng], 14);
    } else {
      const bounds = polyline.getBounds().pad(0.2);
      map.fitBounds(bounds);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [route]);

  // Invalidate map size when expanded toggles
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current!.invalidateSize(), 300);
    }
  }, [expanded]);

  if (route.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
          <span className="text-xs font-medium text-foreground/70">{title}</span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-foreground/80"
          >
            {expanded ? (
              <>
                <Minimize2 className="size-3" /> Collapse
              </>
            ) : (
              <>
                <Maximize2 className="size-3" /> Expand
              </>
            )}
          </button>
        </div>
      )}
      <div
        ref={mapRef}
        className={cn(
          "w-full transition-all duration-300",
          expanded ? "h-[60vh]" : "h-56 sm:h-80",
        )}
      />
    </div>
  );
}
