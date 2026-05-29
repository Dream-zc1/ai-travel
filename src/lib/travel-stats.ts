// Approximate country bounding boxes for travel stats
// Order matters: more specific regions checked first
const COUNTRY_BOUNDS: Record<string, { lat: [number, number]; lng: [number, number] }> = {
  新加坡: { lat: [1.2, 1.5], lng: [103.6, 104.1] },
  日本: { lat: [24, 46], lng: [122, 146] },
  韩国: { lat: [33, 39], lng: [124, 132] },
  泰国: { lat: [6, 21], lng: [97, 106] },
  越南: { lat: [9, 24], lng: [102, 110] },
  马来西亚: { lat: [1, 8], lng: [100, 120] },
  菲律宾: { lat: [5, 19], lng: [117, 127] },
  印度尼西亚: { lat: [-11, 6], lng: [95, 141] },
  印度: { lat: [7, 37], lng: [68, 98] },
  中国: { lat: [18, 54], lng: [73, 135] },
  土耳其: { lat: [36, 43], lng: [26, 45] },
  埃及: { lat: [22, 33], lng: [25, 37] },
  南非: { lat: [-35, -22], lng: [16, 34] },
  法国: { lat: [41, 52], lng: [-5, 10] },
  英国: { lat: [49, 61], lng: [-8, 2] },
  德国: { lat: [47, 55], lng: [6, 15] },
  意大利: { lat: [36, 48], lng: [7, 19] },
  西班牙: { lat: [36, 44], lng: [-10, 4] },
  瑞士: { lat: [46, 48], lng: [6, 11] },
  荷兰: { lat: [50, 54], lng: [3, 8] },
  希腊: { lat: [35, 42], lng: [20, 30] },
  俄罗斯: { lat: [41, 82], lng: [20, 180] },
  美国: { lat: [24, 50], lng: [-125, -66] },
  加拿大: { lat: [42, 83], lng: [-141, -52] },
  墨西哥: { lat: [14, 33], lng: [-118, -86] },
  巴西: { lat: [-34, 6], lng: [-74, -34] },
  澳大利亚: { lat: [-44, -10], lng: [113, 155] },
  新西兰: { lat: [-48, -33], lng: [166, 179] },
};

export function detectCountry(lat: number, lng: number): string | null {
  for (const [country, bounds] of Object.entries(COUNTRY_BOUNDS)) {
    if (
      lat >= bounds.lat[0] && lat <= bounds.lat[1] &&
      lng >= bounds.lng[0] && lng <= bounds.lng[1]
    ) {
      return country;
    }
  }
  return null;
}

export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface TravelStats {
  cityCount: number;
  countryCount: number;
  totalKm: number;
}

export function computeStats(
  places: { lat: number; lng: number }[],
): TravelStats {
  const cityCount = places.length;
  if (cityCount === 0) return { cityCount: 0, countryCount: 0, totalKm: 0 };

  // Country detection
  const countries = new Set<string>();
  for (const p of places) {
    const c = detectCountry(p.lat, p.lng);
    if (c) countries.add(c);
  }

  // Total distance: sort geographically and compute pairwise
  const sorted = [...places].sort((a, b) => a.lat - b.lat || a.lng - b.lng);
  let totalKm = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalKm += haversineKm(
      sorted[i - 1].lat,
      sorted[i - 1].lng,
      sorted[i].lat,
      sorted[i].lng,
    );
  }

  return {
    cityCount,
    countryCount: countries.size,
    totalKm: Math.round(totalKm),
  };
}
