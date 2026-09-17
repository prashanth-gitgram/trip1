import type { ChecklistItem, Stay, TimelineItem, TripMeta } from '../types/trip';
import { PLACES } from './places';
import { DAY_SUMMARIES, fullTripTotals } from './routes';

export const TRIP_META: TripMeta = {
  title: 'Kodaikanal Backpacking Trip',
  subtitle:
    'Bangalore → Poombarai → Kookal → Mannavanur → Kodaikanal → Bangalore',
  datesLabel: 'OCT 1–4, 2026',
  startDate: '2026-10-01',
  endDate: '2026-10-04',
  days: 4,
  nights: 3,
  staysCount: 2,
};

export const STAYS: Stay[] = [
  {
    id: 'stay-poombarai',
    name: 'Poombarai',
    locationId: 'd1-poombarai-stay',
    nights: ['2026-10-01', '2026-10-02'],
    notes: 'Nights of Oct 1 and Oct 2. Update lodging pin in COORDINATE_CONFIG.',
  },
  {
    id: 'stay-kodaikanal',
    name: 'Kodaikanal',
    locationId: 'd3-kodaikanal-stay',
    nights: ['2026-10-03'],
    notes: 'Night of Oct 3. Update lodging pin in COORDINATE_CONFIG.',
  },
];

export const DEFAULT_TIMELINE: TimelineItem[] = [
  // Day 1
  {
    id: 't1-1',
    day: 1,
    timeLabel: '04:00',
    title: 'Leave Bangalore',
    description: 'Early start to beat traffic and reach hills with daylight.',
  },
  {
    id: 't1-2',
    day: 1,
    timeLabel: 'Morning',
    title: 'Highway via Salem',
    description: 'Fuel / stretch stops as needed.',
  },
  {
    id: 't1-3',
    day: 1,
    timeLabel: 'Afternoon',
    title: 'Climb toward Kodaikanal',
    description: 'Batlagundu → ghat → pass through town toward Poombarai.',
  },
  {
    id: 't1-4',
    day: 1,
    timeLabel: 'Evening',
    title: 'Poombarai arrive',
    description: 'Viewpoint / temple if energy allows.',
  },
  {
    id: 't1-5',
    day: 1,
    timeLabel: 'Night',
    title: 'Stay — Poombarai',
    description: 'First night in the village.',
  },
  // Day 2
  {
    id: 't2-1',
    day: 2,
    timeLabel: '08:00',
    title: 'Leave Poombarai',
    description: 'Start Kookal–Mannavanur loop.',
  },
  {
    id: 't2-2',
    day: 2,
    timeLabel: 'Morning',
    title: 'Kookal',
    description: 'Village, lake, and falls viewpoints.',
  },
  {
    id: 't2-3',
    day: 2,
    timeLabel: 'Afternoon',
    title: 'Mannavanur',
    description: 'Lake and grasslands.',
  },
  {
    id: 't2-4',
    day: 2,
    timeLabel: 'Evening',
    title: 'Return via Poondi',
    description: 'Back to Poombarai before dark.',
  },
  {
    id: 't2-5',
    day: 2,
    timeLabel: 'Night',
    title: 'Stay — Poombarai',
    description: 'Second night.',
  },
  // Day 3
  {
    id: 't3-1',
    day: 3,
    timeLabel: '09:00',
    title: 'Checkout Poombarai',
    description: 'Drive toward Kodaikanal via Kilavarai.',
  },
  {
    id: 't3-2',
    day: 3,
    timeLabel: 'Late morning',
    title: 'Kodaikanal stay drop',
    description: 'Leave bags, then head to Vattakanal.',
  },
  {
    id: 't3-3',
    day: 3,
    timeLabel: 'Afternoon',
    title: 'Vattakanal & Dolphin’s Nose',
    description: 'Trail time — confirm conditions locally.',
  },
  {
    id: 't3-4',
    day: 3,
    timeLabel: 'Evening',
    title: 'Kodaikanal Lake',
    description: 'Easy stroll / optional boat.',
  },
  {
    id: 't3-5',
    day: 3,
    timeLabel: 'Night',
    title: 'Stay — Kodaikanal',
    description: 'Third night.',
  },
  // Day 4
  {
    id: 't4-1',
    day: 4,
    timeLabel: '07:00',
    title: 'Leave Kodaikanal',
    description: 'Descend ghats with buffer.',
  },
  {
    id: 't4-2',
    day: 4,
    timeLabel: 'Morning',
    title: 'Batlagundu → Dindigul',
    description: 'Fuel and meal stops.',
  },
  {
    id: 't4-3',
    day: 4,
    timeLabel: 'Afternoon',
    title: 'Salem corridor',
    description: 'Long highway stretch.',
  },
  {
    id: 't4-4',
    day: 4,
    timeLabel: 'Evening',
    title: 'Reach Bangalore',
    description: 'Expect city traffic.',
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Vehicle
  { id: 'v-fuel', category: 'vehicle', label: 'Fuel' },
  { id: 'v-tyre', category: 'vehicle', label: 'Tyre pressure' },
  { id: 'v-spare', category: 'vehicle', label: 'Spare tyre' },
  { id: 'v-puncture', category: 'vehicle', label: 'Puncture kit' },
  { id: 'v-tools', category: 'vehicle', label: 'Basic tools' },
  { id: 'v-powerbank', category: 'vehicle', label: 'Power bank' },
  { id: 'v-cable', category: 'vehicle', label: 'Phone charging cable' },
  // Backpack
  { id: 'b-jacket', category: 'backpack', label: 'Jacket' },
  { id: 'b-rain', category: 'backpack', label: 'Rain protection' },
  { id: 'b-shoes', category: 'backpack', label: 'Shoes' },
  { id: 'b-water', category: 'backpack', label: 'Water' },
  { id: 'b-snacks', category: 'backpack', label: 'Snacks' },
  { id: 'b-torch', category: 'backpack', label: 'Torch' },
  { id: 'b-firstaid', category: 'backpack', label: 'First-aid kit' },
  { id: 'b-id', category: 'backpack', label: 'ID' },
  { id: 'b-cash', category: 'backpack', label: 'Cash' },
  // Before leaving
  { id: 'bl-offline', category: 'before_leaving', label: 'Download offline maps' },
  { id: 'bl-route', category: 'before_leaving', label: 'Download route' },
  { id: 'bl-stays', category: 'before_leaving', label: 'Save stays' },
  {
    id: 'bl-emergency',
    category: 'before_leaving',
    label: 'Save emergency contacts',
  },
  { id: 'bl-weather', category: 'before_leaving', label: 'Check weather' },
  {
    id: 'bl-roads',
    category: 'before_leaving',
    label: 'Check road conditions',
  },
];

export function getTripSnapshot() {
  const totals = fullTripTotals();
  return {
    meta: TRIP_META,
    stays: STAYS,
    daySummaries: DAY_SUMMARIES,
    stopCount: PLACES.length,
    totalDistanceKm: totals.distanceKm,
    totalDriveTimeMin: totals.driveTimeMin,
  };
}

export { PLACES, DAY_SUMMARIES };
