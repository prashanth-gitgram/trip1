import type { Coordinates, DaySummary, RouteSegment } from '../types/trip';
import {
  assertOutboundRoute,
  assertReturnRoute,
  getPlacesForDay,
  PLACES,
} from './places';

assertOutboundRoute();
assertReturnRoute();


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

/** Named route corridors — keep outbound and return as separate datasets. */
export const ROUTE_DATASETS = {
  outbound: {
    id: 'outbound' as const,
    label: 'Outbound — Erode / Palani Route',
    day: 1,
    description:
      'Bangalore → Hosur → Krishnagiri → Dharmapuri → Erode → Kangayam → Dharapuram → Palani → Mannavanur → APM Resort. No Salem/Dindigul.',
  },
  local: {
    id: 'local' as const,
    label: 'Local — Mannavanur / Kookal / Poombarai',
    day: 2,
    description:
      'APM Resort base with Kookal, Mannavanur lake/grasslands, optional Poombarai.',
  },
  hills: {
    id: 'hills' as const,
    label: 'Hills — Poombarai / Vattakanal',
    day: 3,
    description:
      'Mannavanur → Poombarai → Kodaikanal → Vattakanal → Dolphin’s Nose → Trippr Hostel.',
  },
  return: {
    id: 'return' as const,
    label: 'Return — Dindigul / Salem Route',
    day: 4,
    description:
      'Kodaikanal → Batlagundu → Dindigul → Salem → Krishnagiri → Hosur → Bangalore. No Erode/Palani.',
  },
} as const;

export function routeDatasetForDay(day: number | 'full') {
  if (day === 1) return ROUTE_DATASETS.outbound;
  if (day === 2) return ROUTE_DATASETS.local;
  if (day === 3) return ROUTE_DATASETS.hills;
  if (day === 4) return ROUTE_DATASETS.return;
  return null;
}

export const DAY_SUMMARIES: DaySummary[] = [
  {
    day: 1,
    date: '2026-10-01',
    title: 'Bangalore → Mannavanur',
    subtitle: 'Outbound via Erode / Palani',
    routeLabel: ROUTE_DATASETS.outbound.label,
    notes:
      'Leave before dawn. Outbound — Erode / Palani Route. Fuel at Erode/Palani. Do not go via Salem/Dindigul. Destination: APM Resort, Mannavanur.',
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
    title: 'Mannavanur / Poombarai local exploration',
    subtitle: 'Kookal loop from APM Resort',
    routeLabel: ROUTE_DATASETS.local.label,
    notes:
      'Base at APM Resort. Kookal village/lake/waterfall area, Mannavanur lake & grasslands, optional Poombarai. Water entry unverified — confirm locally.',
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
    title: 'Mannavanur → Kodaikanal',
    subtitle: 'Poombarai transit + Vattakanal focus',
    routeLabel: ROUTE_DATASETS.hills.label,
    notes:
      'Checkout Mannavanur, brief Poombarai, settle at Trippr Kodaikanal Backpacker Hostel, then Vattakanal / Falls / Dolphin’s Nose. Skip crowded lake circuit unless wanted.',
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
    subtitle: 'Return via Dindigul / Salem',
    routeLabel: ROUTE_DATASETS.return.label,
    notes:
      'Return — Dindigul / Salem Route. Loop home via Batlagundu → Dindigul → Salem → Krishnagiri → Hosur. Do not repeat Erode/Palani outbound.',
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

/** Tighter bbox around the Mannavanur / Poombarai / Kodaikanal hill cluster. */
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
