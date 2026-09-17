export type PlaceType =
  | 'city'
  | 'town'
  | 'village'
  | 'stay'
  | 'viewpoint'
  | 'waterfall'
  | 'lake'
  | 'temple'
  | 'grassland'
  | 'fuel'
  | 'food'
  | 'waypoint';

export type VerificationStatus = 'verified' | 'approximate' | 'needs_verification';

export type DayId = 1 | 2 | 3 | 4 | 'full';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  day: number;
  /** Order within the day's driving route (1-based). */
  order: number;
  coordinates: Coordinates;
  shortDescription: string;
  whyVisit: string;
  approxTimeRequired: string;
  distanceFromPreviousKm: number | null;
  driveTimeFromPreviousMin: number | null;
  notes: string;
  openingInfo?: string;
  safetyNote?: string;
  verificationStatus: VerificationStatus;
  isStay?: boolean;
  isOptional?: boolean;
}

export interface TimelineItem {
  id: string;
  day: number;
  timeLabel: string;
  title: string;
  description?: string;
}

export interface ChecklistItem {
  id: string;
  category: 'vehicle' | 'backpack' | 'before_leaving';
  label: string;
}

export interface Stay {
  id: string;
  name: string;
  locationId: string;
  nights: string[];
  notes: string;
}

export interface TripMeta {
  title: string;
  subtitle: string;
  datesLabel: string;
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  staysCount: number;
}

export interface RouteSegment {
  day: number;
  fromPlaceId: string;
  toPlaceId: string;
  distanceKm: number;
  driveTimeMin: number;
  notes?: string;
}

export interface DaySummary {
  day: number;
  date: string;
  title: string;
  subtitle: string;
  /** Clear route corridor label shown in the itinerary panel. */
  routeLabel: string;
  notes: string;
  totalDistanceKm: number;
  totalDriveTimeMin: number;
}
