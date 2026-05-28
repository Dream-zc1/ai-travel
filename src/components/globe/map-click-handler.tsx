"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

export function MapClickHandler({ onClick }: MapClickHandlerProps) {
  const map = useMap();

  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, onClick]);

  return null;
}
