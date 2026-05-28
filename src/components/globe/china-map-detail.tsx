"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, MapPin, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { convertGeoJSON, gcj02ToWgs84, wgs84ToGcj02 } from "@/lib/coord-convert";
import { chineseCities, type ChinaCity } from "@/data/chinese-cities";
import { PlaceInfoCard } from "./place-info-card";
import { CheckinList } from "./checkin-list";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const GeoJSONComponent = dynamic(
  () => import("react-leaflet").then((m) => m.GeoJSON),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false },
);
const MapClickHandler = dynamic(
  () => import("./map-click-handler").then((m) => m.MapClickHandler),
  { ssr: false },
);
const CityMarkers = dynamic(
  () => import("./city-markers").then((m) => m.CityMarkers),
  { ssr: false },
);

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

    // Nominatim reverse geocode (fast)
    let name = `${gcjLat.toFixed(4)}, ${gcjLng.toFixed(4)}`;
    let address: string | undefined;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${wgsLat}&lon=${wgsLng}&zoom=18&accept-language=zh`,
        { signal: abort.signal, headers: { "User-Agent": "AITravel/1.0" } },
      );
      if (res.ok && !abort.signal.aborted) {
        const data = await res.json();
        name = data.display_name?.split(",")[0] || name;
        address = data.display_name || undefined;
      }
    } catch {}

    if (abort.signal.aborted) return;
    setLoading(false);
    setPlaceInfo({ lat: gcjLat, lng: gcjLng, displayName: name, address });

    // Lazy Wikipedia lookup (don't block)
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
            setPlaceInfo((prev) => prev ? {
              ...prev,
              wikipediaSummary: sData.extract,
              wikipediaThumbnail: sData.thumbnail?.source,
            } : null);
          }
        }
      }
    } catch {}
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

    // Background Wikipedia lookup
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
              setPlaceInfo((prev) => prev ? {
                ...prev,
                wikipediaSummary: sData.extract,
                wikipediaThumbnail: sData.thumbnail?.source,
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
              <MapContainer
                key={mapKey}
                center={[35, 105]}
                zoom={4}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={false}
              >
                <TileLayer
                  attribution="&copy; 高德地图"
                  url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                />
                <MapClickHandler onClick={handleMapClick} />
                {cachedChinaFeature && (
                  <GeoJSONComponent
                    data={cachedChinaFeature}
                    style={{
                      color: "#FFD700",
                      weight: 2.5,
                      fillColor: "rgba(255, 215, 0, 0.08)",
                      fillOpacity: 0.3,
                    }}
                  />
                )}

                {/* Clickable city labels — instant, no API call */}
                <CityMarkers cities={chineseCities} onCityClick={handleCityClick} />

                {/* Place markers */}
                {chinaPlaces.map((p) => (
                  <CircleMarker
                    key={p.id}
                    center={[p.lat, p.lng]}
                    radius={8}
                    pathOptions={{
                      color: "#FFD700",
                      fillColor: "#f97316",
                      fillOpacity: 0.9,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[150px]">
                        <p className="mb-1 font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                        </p>
                        {p.photo && (
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="mt-2 w-full rounded-lg"
                          />
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
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
