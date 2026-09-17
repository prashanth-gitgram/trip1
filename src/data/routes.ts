import type { Coordinates, DaySummary, RouteSegment } from '../types/trip';
import { getPlacesForDay, PLACES } from './places';

/** Earth radius in km */
const R = 6371;

/** Straight-line → approximate road distance multiplier for hill/highway mix */
const ROAD_FACTOR = 1.35;

/** Average speeds (km/h) used only for estimates */
const HIGHWAY_KMH = 55;
const HILL_KMH = 28;

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function estimateRoadKm(a: Coordinates, b: Coordinates): number {
  return Math.round(haversineKm(a, b) * ROAD_FACTOR * 10) / 10;
}

function isHillSegment(fromLat: number, toLat: number): boolean {
  // Rough heuristic: both points south of ~11.2° are in/near hill country
  return fromLat < 11.2 && toLat < 11.2;
}

export function estimateDriveMin(a: Coordinates, b: Coordinates): number {
  const km = estimateRoadKm(a, b);
  const speed = isHillSegment(a.lat, b.lat) ? HILL_KMH : HIGHWAY_KMH;
  return Math.max(5, Math.round((km / speed) * 60));
}

/** Enrich places with distance/time from previous stop (mutates copies). */
export function placesWithLegEstimates(day: number | 'full') {
  const places = getPlacesForDay(day).map((p) => ({ ...p }));
  for (let i = 1; i < places.length; i++) {
    const prev = places[i - 1];
    const curr = places[i];
    // Same physical pin (e.g. stay) → zero leg
    if (
      prev.coordinates.lat === curr.coordinates.lat &&
      prev.coordinates.lng === curr.coordinates.lng
    ) {
      curr.distanceFromPreviousKm = 0;
      curr.driveTimeFromPreviousMin = 0;
      continue;
    }
    curr.distanceFromPreviousKm = estimateRoadKm(
      prev.coordinates,
      curr.coordinates,
    );
    curr.driveTimeFromPreviousMin = estimateDriveMin(
      prev.coordinates,
      curr.coordinates,
    );
  }
  return places;
}

export function buildDaySegments(day: number): RouteSegment[] {
  const places = placesWithLegEstimates(day);
  const segments: RouteSegment[] = [];
  for (let i = 1; i < places.length; i++) {
    const from = places[i - 1];
    const to = places[i];
    segments.push({
      day,
      fromPlaceId: from.id,
      toPlaceId: to.id,
      distanceKm: to.distanceFromPreviousKm ?? 0,
      driveTimeMin: to.driveTimeFromPreviousMin ?? 0,
    });
  }
  return segments;
}

export function dayTotals(day: number): {
  distanceKm: number;
  driveTimeMin: number;
} {
  const segments = buildDaySegments(day);
  return {
    distanceKm:
      Math.round(segments.reduce((s, x) => s + x.distanceKm, 0) * 10) / 10,
    driveTimeMin: segments.reduce((s, x) => s + x.driveTimeMin, 0),
  };
}

export function fullTripTotals(): {
  distanceKm: number;
  driveTimeMin: number;
} {
  let distanceKm = 0;
  let driveTimeMin = 0;
  for (const day of [1, 2, 3, 4] as const) {
    const t = dayTotals(day);
    distanceKm += t.distanceKm;
    driveTimeMin += t.driveTimeMin;
  }
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    driveTimeMin,
  };
}

export const DAY_SUMMARIES: DaySummary[] = [
  {
    day: 1,
    date: '2026-10-01',
    title: 'Bangalore → Poombarai',
    subtitle: 'Long highway day into the hills',
    notes:
      'Leave before dawn. Fuel at Salem/Dindigul. Reach Poombarai with daylight for temple/viewpoint.',
    ...(() => {
      const t = dayTotals(1);
      return {
        totalDistanceKm: t.distanceKm,
        totalDriveTimeMin: t.driveTimeMin,
      };
    })(),
  },
  {
    day: 2,
    date: '2026-10-02',
    title: 'Poombarai → Kookal → Mannavanur → Poombarai',
    subtitle: 'Western loop day',
    notes:
      'Hill roads only. Pack rain gear. Return before dark. Water entry unverified.',
    ...(() => {
      const t = dayTotals(2);
      return {
        totalDistanceKm: t.distanceKm,
        totalDriveTimeMin: t.driveTimeMin,
      };
    })(),
  },
  {
    day: 3,
    date: '2026-10-03',
    title: 'Poombarai → Kodaikanal → Vattakanal',
    subtitle: 'Move stay + trails',
    notes:
      'Checkout Poombarai, settle in Kodaikanal, then Vattakanal / Dolphin’s Nose / lake.',
    ...(() => {
      const t = dayTotals(3);
      return {
        totalDistanceKm: t.distanceKm,
        totalDriveTimeMin: t.driveTimeMin,
      };
    })(),
  },
  {
    day: 4,
    date: '2026-10-04',
    title: 'Kodaikanal → Bangalore',
    subtitle: 'Return drive',
    notes: 'Descend ghats early. Plan for city traffic on arrival.',
    ...(() => {
      const t = dayTotals(4);
      return {
        totalDistanceKm: t.distanceKm,
        totalDriveTimeMin: t.driveTimeMin,
      };
    })(),
  },
];

/** Polyline coordinates for a day (or full trip concatenating days). */
export function routeCoordinatesForDay(day: number | 'full'): Coordinates[] {
  if (day === 'full') {
    const pts: Coordinates[] = [];
    for (const d of [1, 2, 3, 4]) {
      const dayPlaces = getPlacesForDay(d);
      for (const p of dayPlaces) {
        const last = pts[pts.length - 1];
        if (
          last &&
          last.lat === p.coordinates.lat &&
          last.lng === p.coordinates.lng
        ) {
          continue;
        }
        pts.push(p.coordinates);
      }
    }
    return pts;
  }
  return getPlacesForDay(day).map((p) => p.coordinates);
}

export function formatDriveTime(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `~${h} h` : `~${h} h ${m} min`;
}

export function formatDistance(km: number): string {
  return `~${km.toFixed(1)} km`;
}

/** Bounding box of all trip places with padding (degrees). */
export function tripBounds(padding = 0.15): {
  south: number;
  west: number;
  north: number;
  east: number;
} {
  const lats = PLACES.map((p) => p.coordinates.lat);
  const lngs = PLACES.map((p) => p.coordinates.lng);
  return {
    south: Math.min(...lats) - padding,
    north: Math.max(...lats) + padding,
    west: Math.min(...lngs) - padding,
    east: Math.max(...lngs) + padding,
  };
}

/** Tighter bbox around the Kodaikanal / Poombarai hill cluster for higher zoom tiles. */
export function hillsBounds(padding = 0.08): {
  south: number;
  west: number;
  north: number;
  east: number;
} {
  const hillPlaces = PLACES.filter(
    (p) =>
      p.coordinates.lat < 10.5 &&
      p.coordinates.lat > 10.1 &&
      p.coordinates.lng < 77.65 &&
      p.coordinates.lng > 77.25,
  );
  const lats = hillPlaces.map((p) => p.coordinates.lat);
  const lngs = hillPlaces.map((p) => p.coordinates.lng);
  return {
    south: Math.min(...lats) - padding,
    north: Math.max(...lats) + padding,
    west: Math.min(...lngs) - padding,
    east: Math.max(...lngs) + padding,
  };
}
