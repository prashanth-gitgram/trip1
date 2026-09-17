/**
 * ============================================================================
 * COORDINATE CONFIGURATION
 * ============================================================================
 * Update latitude/longitude here. Do not invent values without checking a map.
 *
 * Outbound (Day 1): Bangalore → Hosur → Krishnagiri → Dharmapuri → Erode →
 *   Kangayam → Dharapuram → Palani → Mannavanur → APM Resort
 *   (NO Salem / NO Dindigul on outbound)
 *
 * Return (Day 4): Kodaikanal → Batlagundu → Dindigul → Salem →
 *   Krishnagiri → Hosur → Bangalore
 *   (NO Erode / NO Palani on return)
 *
 * verificationStatus:
 * - verified      → publicly well-known / cross-checked location
 * - approximate   → nearby known point; good enough for route overview
 * - needs_verification → confirm on-site or with a trusted map before relying on navigation
 * ============================================================================
 */

import type { Place } from '../types/trip';

export const COORDINATE_CONFIG: Record<
  string,
  { lat: number; lng: number; note: string }
> = {
  // --- Shared cities ---
  bangalore: {
    lat: 12.9716,
    lng: 77.5946,
    note: 'Bengaluru city centre — verified public coordinate',
  },
  hosur: {
    lat: 12.7409,
    lng: 77.8253,
    note: 'Hosur — verified public coordinate',
  },
  krishnagiri: {
    lat: 12.5186,
    lng: 78.2137,
    note: 'Krishnagiri — verified public coordinate',
  },

  // --- Outbound only (Erode / Palani corridor) ---
  dharmapuri: {
    lat: 12.1277,
    lng: 78.1579,
    note: 'Dharmapuri — verified public coordinate (outbound)',
  },
  erode: {
    lat: 11.341,
    lng: 77.7172,
    note: 'Erode — verified public coordinate (outbound only)',
  },
  kangayam: {
    lat: 11.0052,
    lng: 77.5619,
    note: 'Kangayam / Kangeyam — verified public coordinate (outbound)',
  },
  dharapuram: {
    lat: 10.7381,
    lng: 77.5209,
    note: 'Dharapuram — verified public coordinate (outbound)',
  },
  palani: {
    lat: 10.4503,
    lng: 77.5152,
    note: 'Palani — verified public coordinate (outbound approach)',
  },

  // --- Return only (Dindigul / Salem corridor) ---
  batlagundu: {
    lat: 10.1608,
    lng: 77.6089,
    note: 'Batlagundu junction — approximate (return)',
  },
  dindigul: {
    lat: 10.3673,
    lng: 77.9803,
    note: 'Dindigul — verified public coordinate (return only)',
  },
  salem: {
    lat: 11.6643,
    lng: 78.146,
    note: 'Salem — verified public coordinate (return only — not on Day 1)',
  },

  // --- Hills / stays ---
  mannavanur: {
    lat: 10.2167,
    lng: 77.3417,
    note: 'Mannavanur settlement — approximate',
  },
  apm_resort: {
    lat: 10.2155,
    lng: 77.3428,
    note: 'APM Resort, Mannavanur — needs verification; update to exact lodging pin',
  },
  mannavanur_lake: {
    lat: 10.2148,
    lng: 77.3435,
    note: 'Mannavanur Lake — approximate public map position',
  },
  mannavanur_grasslands: {
    lat: 10.2125,
    lng: 77.3388,
    note: 'Grasslands / sheep farm area — needs verification',
  },
  kookal_village: {
    lat: 10.2915,
    lng: 77.3512,
    note: 'Kookal village — approximate; confirm approach road',
  },
  kookal_lake: {
    lat: 10.293,
    lng: 77.3495,
    note: 'Kookal Lake — approximate; needs verification',
  },
  kookal_waterfalls_viewpoint: {
    lat: 10.2885,
    lng: 77.3538,
    note: 'Kookal waterfall / farmland area — needs verification',
  },
  poombarai: {
    lat: 10.2705,
    lng: 77.4168,
    note: 'Poombarai village centre — approximate',
  },
  poombarai_village: {
    lat: 10.2712,
    lng: 77.4155,
    note: 'Poombarai village walk area — needs verification',
  },
  poombarai_viewpoint: {
    lat: 10.2688,
    lng: 77.4185,
    note: 'Common viewpoint near Poombarai — needs verification',
  },
  kodaikanal_town: {
    lat: 10.2381,
    lng: 77.4892,
    note: 'Kodaikanal town — verified public coordinate',
  },
  trippr_hostel: {
    lat: 10.2381,
    lng: 77.4892,
    note: 'Trippr Kodaikanal Backpacker Hostel — needs verification; update exact pin',
  },
  vattakanal: {
    lat: 10.2208,
    lng: 77.4815,
    note: 'Vattakanal village — approximate',
  },
  vattakanal_waterfalls: {
    lat: 10.2185,
    lng: 77.4798,
    note: 'Vattakanal falls trail area — needs verification',
  },
  dolphins_nose: {
    lat: 10.2162,
    lng: 77.4855,
    note: "Dolphin's Nose viewpoint — approximate public trail end",
  },
};

function coord(id: string) {
  const c = COORDINATE_CONFIG[id];
  if (!c) throw new Error(`Missing COORDINATE_CONFIG entry: ${id}`);
  return { lat: c.lat, lng: c.lng };
}

/**
 * All trip places by day.
 * Distances/times between consecutive stops are estimates (see routes.ts).
 */
export const PLACES: Place[] = [
  // ========== DAY 1 — Outbound: Erode / Palani Route ==========
  {
    id: 'd1-bangalore',
    name: 'Bangalore',
    type: 'city',
    day: 1,
    order: 1,
    coordinates: coord('bangalore'),
    shortDescription: 'Trip start — outbound via Erode / Palani.',
    whyVisit: 'Starting point of the drive to Mannavanur.',
    approxTimeRequired: 'Departure',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Outbound — Erode / Palani Route. Do not use Salem/Dindigul on Day 1.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-hosur',
    name: 'Hosur',
    type: 'town',
    day: 1,
    order: 2,
    coordinates: coord('hosur'),
    shortDescription: 'First outbound highway stop.',
    whyVisit: 'Fuel / stretch on the way south-east.',
    approxTimeRequired: '15–30 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound corridor only.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-krishnagiri',
    name: 'Krishnagiri',
    type: 'town',
    day: 1,
    order: 3,
    coordinates: coord('krishnagiri'),
    shortDescription: 'Outbound waypoint toward Dharmapuri.',
    whyVisit: 'Highway break.',
    approxTimeRequired: 'Pass-through / short stop',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Also appears on return — different day/order.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-dharmapuri',
    name: 'Dharmapuri',
    type: 'town',
    day: 1,
    order: 4,
    coordinates: coord('dharmapuri'),
    shortDescription: 'Outbound toward Erode.',
    whyVisit: 'Fuel / food before Erode stretch.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound only — not on return route.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-erode',
    name: 'Erode',
    type: 'town',
    day: 1,
    order: 5,
    coordinates: coord('erode'),
    shortDescription: 'Key outbound hub toward Kangayam / Palani.',
    whyVisit: 'Major break on the Erode / Palani approach.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound only — return does NOT go via Erode.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-kangayam',
    name: 'Kangayam',
    type: 'town',
    day: 1,
    order: 6,
    coordinates: coord('kangayam'),
    shortDescription: 'Outbound toward Dharapuram.',
    whyVisit: 'Corridor town on the Palani approach.',
    approxTimeRequired: 'Pass-through / short stop',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound only.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-dharapuram',
    name: 'Dharapuram',
    type: 'town',
    day: 1,
    order: 7,
    coordinates: coord('dharapuram'),
    shortDescription: 'Outbound toward Palani.',
    whyVisit: 'Last plains town before Palani area.',
    approxTimeRequired: '15–30 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound only.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-palani',
    name: 'Palani',
    type: 'town',
    day: 1,
    order: 8,
    coordinates: coord('palani'),
    shortDescription: 'Approach Mannavanur from the Palani side.',
    whyVisit: 'Fuel / food before the hill climb to Mannavanur.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Outbound only — not on Day 4 return.',
    verificationStatus: 'verified',
  },
  {
    id: 'd1-mannavanur',
    name: 'Mannavanur',
    type: 'village',
    day: 1,
    order: 9,
    coordinates: coord('mannavanur'),
    shortDescription: 'Hill destination area for nights 1–2.',
    whyVisit: 'Arrive with daylight if possible.',
    approxTimeRequired: 'Arrival',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Approach from Palani side — road conditions vary.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd1-apm-resort',
    name: 'APM Resort',
    type: 'stay',
    day: 1,
    order: 10,
    coordinates: coord('apm_resort'),
    shortDescription: 'Stay — APM Resort, Mannavanur (Oct 1 night).',
    whyVisit: 'Base for Mannavanur / Kookal exploration.',
    approxTimeRequired: 'Night',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Update COORDINATE_CONFIG.apm_resort to the exact resort pin when confirmed.',
    isStay: true,
    verificationStatus: 'needs_verification',
  },

  // ========== DAY 2 — Local exploration ==========
  {
    id: 'd2-apm-start',
    name: 'APM Resort / Mannavanur',
    type: 'stay',
    day: 2,
    order: 1,
    coordinates: coord('apm_resort'),
    shortDescription: 'Start local exploration from the stay.',
    whyVisit: 'Day base for Kookal / Mannavanur / Poombarai side trips.',
    approxTimeRequired: 'Morning departure',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Pack water, snacks, rain layer. Return before dark.',
    isStay: true,
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd2-kookal-village',
    name: 'Kookal Village',
    type: 'village',
    day: 2,
    order: 2,
    coordinates: coord('kookal_village'),
    shortDescription: 'Quiet village on the Mannavanur side.',
    whyVisit: 'Scenic drive and local village atmosphere.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Narrow hill roads — drive slowly.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd2-kookal-lake',
    name: 'Kookal Lake',
    type: 'lake',
    day: 2,
    order: 3,
    coordinates: coord('kookal_lake'),
    shortDescription: 'Small hill lake near Kookal.',
    whyVisit: 'Calm water and open views.',
    approxTimeRequired: '30–60 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Access and parking can vary — Needs verification.',
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd2-kookal-falls',
    name: 'Kookal Waterfall Area',
    type: 'waterfall',
    day: 2,
    order: 4,
    coordinates: coord('kookal_waterfalls_viewpoint'),
    shortDescription: 'Waterfall / farmland viewpoint near Kookal.',
    whyVisit: 'Landscape stop — conditions vary by season.',
    approxTimeRequired: '45–90 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Do not assume swimming or rock slides are safe or available.',
    safetyNote:
      'Water conditions can change. Confirm locally before entering.',
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd2-mannavanur-lake',
    name: 'Mannavanur Lake',
    type: 'lake',
    day: 2,
    order: 5,
    coordinates: coord('mannavanur_lake'),
    shortDescription: 'Lake surrounded by meadows.',
    whyVisit: 'Signature Mannavanur landscape stop.',
    approxTimeRequired: '45–90 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Respect local rules and farmland boundaries.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd2-mannavanur-grasslands',
    name: 'Mannavanur Grasslands / Sheep Farm',
    type: 'grassland',
    day: 2,
    order: 6,
    coordinates: coord('mannavanur_grasslands'),
    shortDescription: 'Open grasslands and pastoral views.',
    whyVisit: 'Wide skies and Western Ghats scenery.',
    approxTimeRequired: '45–90 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Entry/permissions for farm areas — Needs verification.',
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd2-poombarai',
    name: 'Poombarai',
    type: 'village',
    day: 2,
    order: 7,
    coordinates: coord('poombarai'),
    shortDescription: 'Optional side visit if time and energy allow.',
    whyVisit: 'Quiet village / viewpoint nearby.',
    approxTimeRequired: '45–90 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Skip if running late — base stay remains Mannavanur.',
    isOptional: true,
    verificationStatus: 'approximate',
  },
  {
    id: 'd2-poombarai-viewpoint',
    name: 'Poombarai Viewpoint',
    type: 'viewpoint',
    day: 2,
    order: 8,
    coordinates: coord('poombarai_viewpoint'),
    shortDescription: 'Optional viewpoint near Poombarai.',
    whyVisit: 'Evening light over the valley if visiting Poombarai.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Optional — pin needs verification.',
    isOptional: true,
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd2-apm-return',
    name: 'APM Resort',
    type: 'stay',
    day: 2,
    order: 9,
    coordinates: coord('apm_resort'),
    shortDescription: 'Return to stay (Oct 2 night).',
    whyVisit: 'Rest after local exploration.',
    approxTimeRequired: 'Night',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Second night at APM Resort, Mannavanur.',
    isStay: true,
    verificationStatus: 'needs_verification',
  },

  // ========== DAY 3 — To Kodaikanal / Vattakanal ==========
  {
    id: 'd3-mannavanur',
    name: 'Mannavanur',
    type: 'village',
    day: 3,
    order: 1,
    coordinates: coord('mannavanur'),
    shortDescription: 'Checkout APM Resort and leave for Kodaikanal.',
    whyVisit: 'Start Day 3 from the Mannavanur base.',
    approxTimeRequired: 'Checkout',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Pack vehicle fully before leaving.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd3-poombarai',
    name: 'Poombarai',
    type: 'village',
    day: 3,
    order: 2,
    coordinates: coord('poombarai'),
    shortDescription: 'Transit / short stop toward Kodaikanal.',
    whyVisit: 'Scenic stretch between Mannavanur and Kodaikanal.',
    approxTimeRequired: 'Brief stop if needed',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Keep the day focused — avoid long detours.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd3-kodaikanal',
    name: 'Kodaikanal',
    type: 'town',
    day: 3,
    order: 3,
    coordinates: coord('kodaikanal_town'),
    shortDescription: 'Drop bags at Trippr, then head to Vattakanal.',
    whyVisit: 'Base for Vattakanal / Dolphin’s Nose.',
    approxTimeRequired: '30–60 min settle',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Skip crowded lake loop unless you specifically want it.',
    verificationStatus: 'verified',
  },
  {
    id: 'd3-vattakanal',
    name: 'Vattakanal',
    type: 'village',
    day: 3,
    order: 4,
    coordinates: coord('vattakanal'),
    shortDescription: 'Quiet hamlet below Kodaikanal.',
    whyVisit: 'Gateway to falls and Dolphin’s Nose.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Parking can be limited on weekends.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd3-vattakanal-falls',
    name: 'Vattakanal Falls',
    type: 'waterfall',
    day: 3,
    order: 5,
    coordinates: coord('vattakanal_waterfalls'),
    shortDescription: 'Falls / stream area near Vattakanal.',
    whyVisit: 'Nature stop on the way to the viewpoint trail.',
    approxTimeRequired: '45–90 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Flow and access vary by season.',
    safetyNote:
      'Water conditions can change. Confirm locally before entering.',
    verificationStatus: 'needs_verification',
  },
  {
    id: 'd3-dolphins-nose',
    name: "Dolphin's Nose",
    type: 'viewpoint',
    day: 3,
    order: 6,
    coordinates: coord('dolphins_nose'),
    shortDescription: 'Cliff viewpoint hike from Vattakanal side.',
    whyVisit: 'Classic valley view — focus of the afternoon.',
    approxTimeRequired: '1.5–3 hrs round trip',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Trail difficulty and closures — Needs verification. Wear grip shoes.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd3-trippr-stay',
    name: 'Trippr Kodaikanal Backpacker Hostel',
    type: 'stay',
    day: 3,
    order: 7,
    coordinates: coord('trippr_hostel'),
    shortDescription: 'Overnight in Kodaikanal (Oct 3).',
    whyVisit: 'Rest before the return drive.',
    approxTimeRequired: 'Night',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Update COORDINATE_CONFIG.trippr_hostel to the exact hostel pin.',
    isStay: true,
    verificationStatus: 'needs_verification',
  },

  // ========== DAY 4 — Return: Dindigul / Salem Route ==========
  {
    id: 'd4-kodaikanal',
    name: 'Kodaikanal',
    type: 'town',
    day: 4,
    order: 1,
    coordinates: coord('kodaikanal_town'),
    shortDescription: 'Checkout and begin return via Dindigul / Salem.',
    whyVisit: 'Start loop return — different corridor from Day 1.',
    approxTimeRequired: 'Morning departure',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes:
      'Return — Dindigul / Salem Route. Do NOT go back via Erode / Palani.',
    verificationStatus: 'verified',
  },
  {
    id: 'd4-batlagundu',
    name: 'Batlagundu',
    type: 'town',
    day: 4,
    order: 2,
    coordinates: coord('batlagundu'),
    shortDescription: 'End of main ghat section on return.',
    whyVisit: 'Fuel / food after descent.',
    approxTimeRequired: '15–30 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Return corridor only.',
    verificationStatus: 'approximate',
  },
  {
    id: 'd4-dindigul',
    name: 'Dindigul',
    type: 'town',
    day: 4,
    order: 3,
    coordinates: coord('dindigul'),
    shortDescription: 'Return highway town toward Salem.',
    whyVisit: 'Meal / fuel stop on the return loop.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Return only — not on Day 1 outbound.',
    verificationStatus: 'verified',
  },
  {
    id: 'd4-salem',
    name: 'Salem',
    type: 'town',
    day: 4,
    order: 4,
    coordinates: coord('salem'),
    shortDescription: 'Major return waypoint (not used outbound).',
    whyVisit: 'Break before Krishnagiri / Hosur stretch.',
    approxTimeRequired: '20–40 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Return only — Salem must not appear on Day 1.',
    verificationStatus: 'verified',
  },
  {
    id: 'd4-krishnagiri',
    name: 'Krishnagiri',
    type: 'town',
    day: 4,
    order: 5,
    coordinates: coord('krishnagiri'),
    shortDescription: 'Return toward Hosur / Bangalore.',
    whyVisit: 'Highway waypoint on the return loop.',
    approxTimeRequired: 'Pass-through / short stop',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Return order — after Salem, not after Hosur as on Day 1.',
    verificationStatus: 'verified',
  },
  {
    id: 'd4-hosur',
    name: 'Hosur',
    type: 'town',
    day: 4,
    order: 6,
    coordinates: coord('hosur'),
    shortDescription: 'Last major stop before Bangalore.',
    whyVisit: 'Fuel / stretch before city traffic.',
    approxTimeRequired: '15–30 min',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Return corridor.',
    verificationStatus: 'verified',
  },
  {
    id: 'd4-bangalore',
    name: 'Bangalore',
    type: 'city',
    day: 4,
    order: 7,
    coordinates: coord('bangalore'),
    shortDescription: 'Trip end — loop complete.',
    whyVisit: 'Home.',
    approxTimeRequired: 'Arrival',
    distanceFromPreviousKm: null,
    driveTimeFromPreviousMin: null,
    notes: 'Expect evening traffic into the city.',
    verificationStatus: 'verified',
  },
];

export function getPlacesForDay(day: number | 'full'): Place[] {
  if (day === 'full') {
    return PLACES;
  }
  return PLACES.filter((p) => p.day === day).sort((a, b) => a.order - b.order);
}

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

/** Guard: Day 1 must never include Salem or Dindigul. */
export function assertOutboundRoute(): void {
  const day1 = getPlacesForDay(1);
  for (const p of day1) {
    const n = p.name.toLowerCase();
    if (n.includes('salem') || n.includes('dindigul')) {
      throw new Error(`Outbound Day 1 must not include ${p.name}`);
    }
  }
}

/** Guard: Day 4 must never include Erode or Palani. */
export function assertReturnRoute(): void {
  const day4 = getPlacesForDay(4);
  for (const p of day4) {
    const n = p.name.toLowerCase();
    if (n.includes('erode') || n.includes('palani')) {
      throw new Error(`Return Day 4 must not include ${p.name}`);
    }
  }
}
