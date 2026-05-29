"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, MapPin, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { convertGeoJSON, gcj02ToWgs84, wgs84ToGcj02 } from "@/lib/coord-convert";
import { chineseCities, type ChinaCity } from "@/data/chinese-cities";
import { PlaceInfoCard } from "./place-info-card";
import { CheckinList } from "./checkin-list";

const LeafletMap = dynamic(() => import("./leaflet-map").then((m) => m.LeafletMapInner), { ssr: false });

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  photo: string | null;
}

interface ChinaMapDetailProps {
  open: boolean;
  onClose: () => void;
  places?: Place[];
}

interface PlaceInfo {
  lat: number;
  lng: number;
  displayName: string;
  address?: string;
  wikipediaSummary?: string;
  wikipediaThumbnail?: string;
}

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/npm/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson";

let cachedChinaFeature: any = null;
let geoFetchPromise: Promise<void> | null = null;

// Simple in-memory cache for geocode / Wikipedia lookups
const cache = new Map<string, { data: any; expiry: number }>();
function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) { cache.delete(key); return undefined; }
  return entry.data as T;
}
function cacheSet(key: string, data: any, ttlMs = 3600000) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}
function cacheKey(lat: number, lng: number) {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

function ensureGeoLoaded(): Promise<void> {
  if (cachedChinaFeature) return Promise.resolve();
  if (geoFetchPromise) return geoFetchPromise;
  geoFetchPromise = fetch(GEOJSON_URL)
    .then((r) => r.json())
    .then((data) => {
      const raw = data.features.find(
        (f: any) =>
          f.properties.ISO_A3 === "CHN" || f.properties.ADMIN === "China",
      );
      if (raw) cachedChinaFeature = convertGeoJSON(raw);
    })
    .catch(() => {});
  return geoFetchPromise;
}

export function ChinaMapDetail({ open, onClose, places }: ChinaMapDetailProps) {
  const [ready, setReady] = useState(!!cachedChinaFeature);
  const [mapKey, setMapKey] = useState(0);
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [showCheckins, setShowCheckins] = useState(false);
  const [clickCoords, setClickCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    ensureGeoLoaded().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (open) {
      setPlaceInfo(null);
      setShowCheckins(false);
      setClickCoords(null);
      setMapKey((k) => k + 1);
    }
  }, [open]);

  const handleMapClick = useCallback(async (gcjLat: number, gcjLng: number) => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setClickCoords({ lat: gcjLat, lng: gcjLng });
    setLoading(true);
    setPlaceInfo({
      lat: gcjLat,
      lng: gcjLng,
      displayName: `${gcjLat.toFixed(4)}, ${gcjLng.toFixed(4)}`,
    });

    const [wgsLat, wgsLng] = gcj02ToWgs84(gcjLat, gcjLng);
    const ckey = cacheKey(wgsLat, wgsLng);

    // Nominatim reverse geocode with cache
    let name = `${gcjLat.toFixed(4)}, ${gcjLng.toFixed(4)}`;
    let address: string | undefined;
    const cachedNominatim = cacheGet<{ name: string; address?: string }>(`n:${ckey}`);
    if (cachedNominatim) {
      name = cachedNominatim.name;
      address = cachedNominatim.address;
    } else {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${wgsLat}&lon=${wgsLng}&zoom=18&accept-language=zh`,
          { signal: abort.signal, headers: { "User-Agent": "AITravel/1.0" } },
        );
        if (res.ok && !abort.signal.aborted) {
          const data = await res.json();
          name = data.display_name?.split(",")[0] || name;
          address = data.display_name || undefined;
          cacheSet(`n:${ckey}`, { name, address });
        }
      } catch {} // Falls back to showing coords — graceful degradation
    }

    if (abort.signal.aborted) return;
    setLoading(false);
    setPlaceInfo({ lat: gcjLat, lng: gcjLng, displayName: name, address });

    // Lazy Wikipedia lookup with cache
    const cachedWiki = cacheGet<{ summary: string; thumbnail?: string }>(`w:${ckey}`);
    if (cachedWiki) {
      setPlaceInfo((prev) => prev ? { ...prev, wikipediaSummary: cachedWiki.summary, wikipediaThumbnail: cachedWiki.thumbnail } : null);
    } else {
      try {
        const geoRes = await fetch(
          `https://zh.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${wgsLat}|${wgsLng}&gsradius=200&gslimit=1&format=json&origin=*`,
          { signal: abort.signal },
        );
        if (geoRes.ok && !abort.signal.aborted) {
          const geoData = await geoRes.json();
          const page = geoData.query?.geosearch?.[0];
          if (page?.title) {
            const sRes = await fetch(
              `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`,
              { signal: abort.signal },
            );
            if (sRes.ok && !abort.signal.aborted) {
              const sData = await sRes.json();
              const summary = sData.extract;
              const thumbnail = sData.thumbnail?.source;
              cacheSet(`w:${ckey}`, { summary, thumbnail });
              setPlaceInfo((prev) => prev ? {
                ...prev,
                wikipediaSummary: summary,
                wikipediaThumbnail: thumbnail,
              } : null);
            }
          }
        }
      } catch {}
    }
  }, []);

  // Instant city label click — no Nominatim needed, we already have the name
  const handleCityClick = useCallback((city: ChinaCity) => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const [gcjLat, gcjLng] = wgs84ToGcj02(city.lat, city.lng);

    setClickCoords({ lat: gcjLat, lng: gcjLng });
    setLoading(false);
    setPlaceInfo({
      lat: gcjLat,
      lng: gcjLng,
      displayName: city.name,
    });

    // Background Wikipedia lookup with cache
    const ckey = cacheKey(city.lat, city.lng);
    const cachedWiki = cacheGet<{ summary: string; thumbnail?: string }>(`w:${ckey}`);
    if (cachedWiki) {
      setPlaceInfo((prev) => prev ? { ...prev, wikipediaSummary: cachedWiki.summary, wikipediaThumbnail: cachedWiki.thumbnail } : null);
      return;
    }

    (async () => {
      try {
        const geoRes = await fetch(
          `https://zh.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${city.lat}|${city.lng}&gsradius=500&gslimit=1&format=json&origin=*`,
          { signal: abort.signal },
        );
        if (geoRes.ok && !abort.signal.aborted) {
          const geoData = await geoRes.json();
          const page = geoData.query?.geosearch?.[0];
          if (page?.title) {
            const sRes = await fetch(
              `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`,
              { signal: abort.signal },
            );
            if (sRes.ok && !abort.signal.aborted) {
              const sData = await sRes.json();
              const summary = sData.extract;
              const thumbnail = sData.thumbnail?.source;
              cacheSet(`w:${ckey}`, { summary, thumbnail });
              setPlaceInfo((prev) => prev ? {
                ...prev,
                wikipediaSummary: summary,
                wikipediaThumbnail: thumbnail,
              } : null);
            }
          }
        }
      } catch {}
    })();
  }, []);

  // Filter places within China bounds and convert coords
  const chinaPlaces = (places || [])
    .filter((p) => p.lat > 0 && p.lat < 55 && p.lng > 72 && p.lng < 138)
    .map((p) => {
      const [gcjLat, gcjLng] = wgs84ToGcj02(p.lat, p.lng);
      return { ...p, lat: gcjLat, lng: gcjLng };
    });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="relative h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border/40 bg-background shadow-2xl"
          >
            {/* Back button */}
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-[1000] flex items-center gap-1.5 rounded-full bg-background/80 px-3.5 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md transition-all hover:bg-background"
            >
              <ArrowLeft className="size-4" />
              返回
            </button>

            {/* Map */}
            {!ready ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <LeafletMap
                key={mapKey}
                chinaFeature={cachedChinaFeature}
                places={chinaPlaces}
                onMapClick={handleMapClick}
                onCityClick={handleCityClick}
              />
            )}

            {/* Place info card */}
            <PlaceInfoCard
              info={placeInfo}
              loading={loading}
              onClose={() => { setPlaceInfo(null); setClickCoords(null); }}
              onShowCheckins={() => setShowCheckins(true)}
            />
          </motion.div>

          {/* Checkin list modal */}
          {clickCoords && (
            <CheckinList
              open={showCheckins}
              onClose={() => setShowCheckins(false)}
              lat={clickCoords.lat}
              lng={clickCoords.lng}
              placeName={placeInfo?.displayName || "未知地点"}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
