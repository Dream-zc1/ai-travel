"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { Globe2 } from "lucide-react";

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  photo: string | null;
}

interface GlobeViewProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
  onCountryClick?: (country: { name: string; isoA3: string }) => void;
  onGlobeDoubleClick?: (lat: number, lng: number) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/npm/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson";

export function GlobeView({ places, onPlaceClick, onCountryClick, onGlobeDoubleClick, onCanvasReady }: GlobeViewProps) {
  const globeEl = useRef<any>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  // Load GeoJSON
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => setCountries(data.features))
      .catch(() => {});
  }, []);

  // Auto-rotate + center on Asia
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.8;
      globeEl.current.pointOfView({ lat: 20, lng: 105 }, 0);
      // Expose canvas for share poster
      const canvas = globeEl.current.renderer()?.domElement;
      if (canvas) onCanvasReady?.(canvas);
    }
  }, [onCanvasReady]);

  // Double-click handler using Three.js raycasting
  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      const globe = globeEl.current;
      if (!globe || !onGlobeDoubleClick) return;

      const camera = globe.camera();
      const renderer = globe.renderer();
      const scene = globe.scene();

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouse, camera);

      // Find the globe mesh
      let globeMesh: THREE.Mesh | null = null;
      scene.traverse((child: THREE.Object3D) => {
        if (child.type === "Mesh" && !globeMesh) {
          globeMesh = child as THREE.Mesh;
        }
      });

      if (!globeMesh) return;
      const intersects = raycaster.intersectObject(globeMesh);
      if (intersects.length === 0) return;

      const point = intersects[0].point.clone().normalize();

      // Convert normalized 3D point to lat/lng
      const lat = 90 - Math.acos(Math.max(-1, Math.min(1, point.y))) * (180 / Math.PI);
      const lng = (Math.atan2(point.z, point.x) * (180 / Math.PI) + 360) % 360 - 180;

      onGlobeDoubleClick(lat, lng);
    },
    [onGlobeDoubleClick],
  );

  // Attach dblclick listener after Globe mounts
  useEffect(() => {
    if (!onGlobeDoubleClick || !globeEl.current?.renderer()?.domElement) return;
    const canvas = globeEl.current.renderer().domElement;
    canvas.addEventListener("dblclick", handleDoubleClick);
    return () => canvas.removeEventListener("dblclick", handleDoubleClick);
  }, [handleDoubleClick, onGlobeDoubleClick]);

  const isDark = mounted && resolvedTheme === "dark";

  const globeImg = isDark
    ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
    : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

  const pointsData = places.map((p) => ({
    ...p,
    lat: Number(p.lat),
    lng: Number(p.lng),
    hasPhoto: !!p.photo,
  }));

  const handlePolygonClick = (polygon: any) => {
    const props = polygon?.properties;
    if (!props) return;
    if (props.ISO_A3 === "CHN" || props.ADMIN === "China") {
      onCountryClick?.({ name: props.ADMIN, isoA3: props.ISO_A3 });
    }
  };

  const polygonLabel = (d: any) => `<b>${d.properties.ADMIN}</b>`;

  if (!mounted || countries.length === 0) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center sm:h-[700px] lg:h-[800px]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full border border-border/30 bg-muted/20">
            <Globe2 className="size-6 animate-pulse text-muted-foreground/30" />
          </div>
          <p className="text-xs text-muted-foreground/40">加载地球中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full sm:h-[700px] lg:h-[800px]">
      <Globe
        ref={globeEl}
        globeImageUrl={globeImg}
        // Country polygons
        polygonsData={countries}
        polygonGeoJsonGeometry={(d: any) => d.geometry}
        polygonCapColor={() => "rgba(0,0,0,0)"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "#FFD700"}
        polygonAltitude={0.005}
        polygonLabel={polygonLabel}
        onPolygonClick={handlePolygonClick}
        // User's place markers
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointColor={() => (isDark ? "#f97316" : "#2563eb")}
        pointRadius={0.25}
        pointsMerge={false}
        onPointClick={(point: any) => onPlaceClick(point as Place)}
        ringsData={pointsData}
        ringLat="lat"
        ringLng="lng"
        ringAltitude={0.015}
        ringColor={() => (isDark ? "#f97316" : "#2563eb")}
        ringResolution={32}
        ringPropagationSpeed={3}
        ringRepeatPeriod={2000}
        labelText="name"
        labelLat="lat"
        labelLng="lng"
        labelAltitude={0.02}
        labelColor={() => (isDark ? "#fff" : "#000")}
        labelSize={0.5}
        labelDotOrientation={() => "bottom" as const}
        atmosphereColor={isDark ? "#3b82f6" : "#60a5fa"}
        atmosphereAltitude={0.15}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  );
}
