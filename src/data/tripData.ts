import type { ChecklistItem, Stay, TimelineItem, TripMeta } from '../types/trip';
import { PLACES } from './places';
import { DAY_SUMMARIES, fullTripTotals, ROUTE_DATASETS } from './routes';

export const TRIP_META: TripMeta = {
  title: 'Kodaikanal Backpacking Trip',
  subtitle:
    'Bangalore → Mannavanur → Kookal → Poombarai → Kodaikanal → Bangalore',
  datesLabel: 'OCT 1–4, 2026',
  startDate: '2026-10-01',
  endDate: '2026-10-04',
  days: 4,
  nights: 3,
  staysCount: 2,
};

export const STAYS: Stay[] = [
  {
    id: 'stay-apm-mannavanur',
    name: 'APM Resort, Mannavanur',
    locationId: 'd1-apm-resort',
    nights: ['2026-10-01', '2026-10-02'],
    notes:
      'Nights of Oct 1 and Oct 2. Update COORDINATE_CONFIG.apm_resort to the exact pin.',
  },
  {
    id: 'stay-trippr-kodaikanal',
    name: 'Trippr Kodaikanal Backpacker Hostel',
    locationId: 'd3-trippr-stay',
    nights: ['2026-10-03'],
    notes:
      'Night of Oct 3. Update COORDINATE_CONFIG.trippr_hostel to the exact pin.',
  },
];

export const DEFAULT_TIMELINE: TimelineItem[] = [
  // Day 1
  {
    id: 't1-1',
    day: 1,
    timeLabel: '04:00',
    title: 'Leave Bangalore',
    description: 'Outbound — Erode / Palani Route. Early start.',
  },
  {
    id: 't1-2',
    day: 1,
    timeLabel: 'Morning',
    title: 'Hosur → Krishnagiri → Dharmapuri',
    description: 'Fuel / stretch as needed. Not via Salem.',
  },
  {
    id: 't1-3',
    day: 1,
    timeLabel: 'Afternoon',
    title: 'Erode → Kangayam → Dharapuram → Palani',
    description: 'Approach Mannavanur from the Palani side.',
  },
  {
    id: 't1-4',
    day: 1,
    timeLabel: 'Evening',
    title: 'Reach Mannavanur',
    description: 'Arrive APM Resort with daylight if possible.',
  },
  {
    id: 't1-5',
    day: 1,
    timeLabel: 'Night',
    title: 'Stay — APM Resort',
    description: 'First night at Mannavanur.',
  },
  // Day 2
  {
    id: 't2-1',
    day: 2,
    timeLabel: '08:00',
    title: 'Leave APM Resort',
    description: 'Local exploration day.',
  },
  {
    id: 't2-2',
    day: 2,
    timeLabel: 'Morning',
    title: 'Kookal',
    description: 'Village, lake, waterfall area — confirm water safety locally.',
  },
  {
    id: 't2-3',
    day: 2,
    timeLabel: 'Afternoon',
    title: 'Mannavanur lake & grasslands',
    description: 'Optional Poombarai if time allows.',
  },
  {
    id: 't2-4',
    day: 2,
    timeLabel: 'Evening',
    title: 'Return to APM Resort',
    description: 'Back before dark.',
  },
  {
    id: 't2-5',
    day: 2,
    timeLabel: 'Night',
    title: 'Stay — APM Resort',
    description: 'Second night at Mannavanur.',
  },
  // Day 3
  {
    id: 't3-1',
    day: 3,
    timeLabel: '09:00',
    title: 'Checkout Mannavanur',
    description: 'Drive via Poombarai toward Kodaikanal.',
  },
  {
    id: 't3-2',
    day: 3,
    timeLabel: 'Late morning',
    title: 'Trippr hostel drop',
    description: 'Leave bags, then head to Vattakanal.',
  },
  {
    id: 't3-3',
    day: 3,
    timeLabel: 'Afternoon',
    title: 'Vattakanal & Dolphin’s Nose',
    description: 'Focus day — confirm trail conditions locally.',
  },
  {
    id: 't3-4',
    day: 3,
    timeLabel: 'Evening',
    title: 'Back to Kodaikanal',
    description: 'Skip crowded attractions unless you want them.',
  },
  {
    id: 't3-5',
    day: 3,
    timeLabel: 'Night',
    title: 'Stay — Trippr Hostel',
    description: 'Third night in Kodaikanal.',
  },
  // Day 4
  {
    id: 't4-1',
    day: 4,
    timeLabel: '07:00',
    title: 'Leave Kodaikanal',
    description: 'Return — Dindigul / Salem Route. Descend ghats early.',
  },
  {
    id: 't4-2',
    day: 4,
    timeLabel: 'Morning',
    title: 'Batlagundu → Dindigul',
    description: 'Fuel and meal stops. Not via Erode/Palani.',
  },
  {
    id: 't4-3',
    day: 4,
    timeLabel: 'Afternoon',
    title: 'Salem → Krishnagiri → Hosur',
    description: 'Loop return corridor.',
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
  { id: 'v-fuel', category: 'vehicle', label: 'Fuel' },
  { id: 'v-tyre', category: 'vehicle', label: 'Tyre pressure' },
  { id: 'v-spare', category: 'vehicle', label: 'Spare tyre' },
  { id: 'v-puncture', category: 'vehicle', label: 'Puncture kit' },
  { id: 'v-tools', category: 'vehicle', label: 'Basic tools' },
  { id: 'v-powerbank', category: 'vehicle', label: 'Power bank' },
  { id: 'v-cable', category: 'vehicle', label: 'Phone charging cable' },
  { id: 'b-jacket', category: 'backpack', label: 'Jacket' },
  { id: 'b-rain', category: 'backpack', label: 'Rain protection' },
  { id: 'b-shoes', category: 'backpack', label: 'Shoes' },
  { id: 'b-water', category: 'backpack', label: 'Water' },
  { id: 'b-snacks', category: 'backpack', label: 'Snacks' },
  { id: 'b-torch', category: 'backpack', label: 'Torch' },
  { id: 'b-firstaid', category: 'backpack', label: 'First-aid kit' },
  { id: 'b-id', category: 'backpack', label: 'ID' },
  { id: 'b-cash', category: 'backpack', label: 'Cash' },
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
    routeDatasets: ROUTE_DATASETS,
    stopCount: PLACES.length,
    totalDistanceKm: totals.distanceKm,
    totalDriveTimeMin: totals.driveTimeMin,
  };
}

export { PLACES, DAY_SUMMARIES, ROUTE_DATASETS };
