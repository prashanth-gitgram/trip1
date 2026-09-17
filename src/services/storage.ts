import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { TimelineItem } from '../types/trip';
import { CHECKLIST_ITEMS, DEFAULT_TIMELINE } from '../data/tripData';
import { PLACES } from '../data/places';

const LS_PREFIX = 'poombarai-trip:';
const DB_NAME = 'poombarai-trip-db';
const DB_VERSION = 1;

interface TripDB extends DBSchema {
  trip_snapshot: {
    key: string;
    value: unknown;
  };
  meta: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<TripDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<TripDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('trip_snapshot')) {
          db.createObjectStore('trip_snapshot');
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      },
    });
  }
  return dbPromise;
}

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
}

/** Persist core itinerary for offline reads via IndexedDB. */
export async function seedOfflineTripData(): Promise<void> {
  const db = await getDb();
  await db.put(
    'trip_snapshot',
    {
      places: PLACES,
      checklist: CHECKLIST_ITEMS,
      timeline: DEFAULT_TIMELINE,
      savedAt: new Date().toISOString(),
    },
    'current',
  );
}

export async function getOfflineTripSnapshot() {
  const db = await getDb();
  return db.get('trip_snapshot', 'current');
}

// --- Checklist ---
export type ChecklistState = Record<string, boolean>;

export function loadChecklist(): ChecklistState {
  const defaults: ChecklistState = {};
  for (const item of CHECKLIST_ITEMS) defaults[item.id] = false;
  return { ...defaults, ...lsGet<ChecklistState>('checklist', {}) };
}

export function saveChecklist(state: ChecklistState) {
  lsSet('checklist', state);
}

// --- Visited places ---
export type VisitedState = Record<string, boolean>;

export function loadVisited(): VisitedState {
  return lsGet<VisitedState>('visited', {});
}

export function saveVisited(state: VisitedState) {
  lsSet('visited', state);
}

// --- Editable timeline ---
export function loadTimeline(): TimelineItem[] {
  return lsGet<TimelineItem[]>('timeline', DEFAULT_TIMELINE);
}

export function saveTimeline(items: TimelineItem[]) {
  lsSet('timeline', items);
}

// --- Offline map meta ---
export interface OfflineMapMeta {
  ready: boolean;
  downloadedAt?: string;
  tileCount?: number;
  approxBytes?: number;
  lastError?: string;
}

export function loadOfflineMapMeta(): OfflineMapMeta {
  return lsGet<OfflineMapMeta>('offline-map-meta', { ready: false });
}

export function saveOfflineMapMeta(meta: OfflineMapMeta) {
  lsSet('offline-map-meta', meta);
}

export async function setMeta(key: string, value: unknown) {
  const db = await getDb();
  await db.put('meta', value, key);
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return (await db.get('meta', key)) as T | undefined;
}
