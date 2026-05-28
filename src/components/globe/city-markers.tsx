"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { ChinaCity } from "@/data/chinese-cities";
import { wgs84ToGcj02 } from "@/lib/coord-convert";

interface CityMarkersProps {
  cities: ChinaCity[];
  onCityClick: (city: ChinaCity) => void;
}

export function CityMarkers({ cities, onCityClick }: CityMarkersProps) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const onClickRef = useRef(onCityClick);
  onClickRef.current = onCityClick;
  const [zoom, setZoom] = useState(map.getZoom());

  // Inject label styles once
  useEffect(() => {
    const id = "city-label-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .cl-marker { background: none !important; border: none !important; }
      .cl-wrap { display: flex !important; align-items: center; gap: 3px; cursor: pointer; white-space: nowrap; pointer-events: auto; }
      .cl-dot { width: 5px; height: 5px; border-radius: 50%; background: #FFD700; border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0; box-shadow: 0 0 3px rgba(255,215,0,0.5); }
      .cl-text { font-size: 12px; font-weight: 600; color: #1a1a2e; text-shadow: 0 0 3px #fff, 0 0 6px rgba(255,255,255,0.8); padding: 1px 4px; border-radius: 3px; transition: background 0.15s, color 0.15s; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif; letter-spacing: 0.02em; }
      .cl-text:hover { background: rgba(255,215,0,0.3); color: #e65c00; }
    `;
    document.head.appendChild(style);
  }, []);

  // Track zoom changes
  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on("zoomend", handler);
    return () => { map.off("zoomend", handler); };
  }, [map]);

  // Render markers
  useEffect(() => {
    markersRef.current.forEach((m) => m.removeFrom(map));
    markersRef.current = [];

    const visible =
      zoom < 5
        ? cities.filter((c) => c.level === "province")
        : cities;

    const markers = visible.map((city) => {
      const [gcjLat, gcjLng] = wgs84ToGcj02(city.lat, city.lng);
      const icon = L.divIcon({
        className: "cl-marker",
        html: `<div class="cl-wrap"><span class="cl-dot"></span><span class="cl-text">${city.name}</span></div>`,
        iconSize: [0, 0],
        iconAnchor: [3, 3],
      });

      const marker = L.marker([gcjLat, gcjLng], { icon });
      marker.on("click", () => onClickRef.current(city));
      marker.addTo(map);
      return marker;
    });

    markersRef.current = markers;
    return () => markers.forEach((m) => m.removeFrom(map));
  }, [map, cities, zoom]);

  return null;
}
