"use client";

import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import { MapClickHandler } from "./map-click-handler";
import { CityMarkers } from "./city-markers";
import { chineseCities, type ChinaCity } from "@/data/chinese-cities";

interface LeafletMapInnerProps {
  chinaFeature: any;
  places: { id: number; name: string; lat: number; lng: number; photo: string | null }[];
  onMapClick: (lat: number, lng: number) => void;
  onCityClick: (city: ChinaCity) => void;
}

export function LeafletMapInner({ chinaFeature, places, onMapClick, onCityClick }: LeafletMapInnerProps) {
  return (
    <MapContainer center={[35, 105]} zoom={4} scrollWheelZoom={true} className="h-full w-full" zoomControl={false}>
      <TileLayer
        attribution="&copy; 高德地图"
        url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
      />
      <MapClickHandler onClick={onMapClick} />
      {chinaFeature && (
        <GeoJSON
          data={chinaFeature}
          style={{
            color: "#FFD700",
            weight: 2.5,
            fillColor: "rgba(255, 215, 0, 0.08)",
            fillOpacity: 0.3,
          }}
        />
      )}
      <CityMarkers cities={chineseCities} onCityClick={onCityClick} />
      {places.map((p) => (
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
                <img src={p.photo} alt={p.name} className="mt-2 w-full rounded-lg" />
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
