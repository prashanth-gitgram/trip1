/**
 * Offline map tile caching for the trip region only.
 *
 * Tile source: OpenStreetMap standard tiles
 *   https://tile.openstreetmap.org/{z}/{x}/{y}.png
 *
 * Usage policy (https://operations.osmfoundation.org/policies/tiles/):
 * - Personal / lightweight use only; do not bulk-download large regions
 * - Keep concurrent downloads low (we cap at 2)
 * - Cache only the trip bounding boxes and limited zoom ranges
 * - Always show © OpenStreetMap attribution
 * - For heavy or commercial use, use your own tile server or a commercial provider
 *
 * How offline works:
 * OSM tiles are not CORS-readable via fetch() from a web app. Instead:
 * 1. The PWA service worker caches tile.openstreetmap.org with CacheFirst
 *    (see vite.config.ts → workbox.runtimeCaching).
 * 2. "Download Offline Trip Area" preloads tiles via Image() requests so the
 *    service worker stores them in Cache Storage.
 * 3. Leaflet TileLayer requests the same URLs; offline hits come from the SW cache.
 *
 * Zoom strategy:
 * - Full trip corridor: z8–z11
 * - Hills focus (Poombarai / Kodaikanal / Kookal / Mannavanur): z12–z14
 */

import { hillsBounds, tripBounds } from '../data/routes';
import {
  loadOfflineMapMeta,
  saveOfflineMapMeta,
  seedOfflineTripData,
  type OfflineMapMeta,
} from './storage';

export const TILE_CACHE_NAME = 'poombarai-osm-tiles-v1';
export const TILE_URL_TEMPLATE =
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const MAX_CONCURRENT = 2;
const MAX_TILES = 4500;

export interface DownloadProgress {
  done: number;
  total: number;
  percent: number;
  approxBytes: number;
  status: 'idle' | 'downloading' | 'done' | 'error';
  message?: string;
}

function lon2tile(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}

function lat2tile(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      2 ** zoom,
  );
}

function tileUrl(z: number, x: number, y: number) {
  return TILE_URL_TEMPLATE.replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y));
}

interface BBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

function enumerateTiles(
  bbox: BBox,
  zMin: number,
  zMax: number,
): { z: number; x: number; y: number; url: string }[] {
  const tiles: { z: number; x: number; y: number; url: string }[] = [];
  for (let z = zMin; z <= zMax; z++) {
    const xMin = lon2tile(bbox.west, z);
    const xMax = lon2tile(bbox.east, z);
    const yMin = lat2tile(bbox.north, z);
    const yMax = lat2tile(bbox.south, z);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        tiles.push({ z, x, y, url: tileUrl(z, x, y) });
      }
    }
  }
  return tiles;
}

export function planOfflineTiles(): {
  tiles: { z: number; x: number; y: number; url: string }[];
  estimatedBytes: number;
} {
  const corridor = enumerateTiles(tripBounds(0.12), 8, 11);
  const hills = enumerateTiles(hillsBounds(0.06), 12, 14);
  const seen = new Set<string>();
  const tiles = [...corridor, ...hills].filter((t) => {
    const key = `${t.z}/${t.x}/${t.y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const limited = tiles.slice(0, MAX_TILES);
  const estimatedBytes = limited.length * 18_000;
  return { tiles: limited, estimatedBytes };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getOfflineMapStatus(): OfflineMapMeta {
  return loadOfflineMapMeta();
}

/** Wait until a service worker is controlling this page (needed for tile cache). */
async function ensureServiceWorkerControl(
  timeoutMs = 8000,
): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;
  if (navigator.serviceWorker.controller) return true;
  try {
    await navigator.serviceWorker.ready;
  } catch {
    return false;
  }
  if (navigator.serviceWorker.controller) return true;
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(false), timeoutMs);
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => {
        window.clearTimeout(timer);
        resolve(!!navigator.serviceWorker.controller);
      },
      { once: true },
    );
  });
}

/**
 * Prefetch a tile via <img> so the service worker can CacheFirst-store it.
 * Does not require CORS on the tile server.
 */
function prefetchTile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = (ok: boolean) => {
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
  });
}

export async function downloadOfflineTripArea(
  onProgress: (p: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<OfflineMapMeta> {
  if (!navigator.onLine) {
    const err: OfflineMapMeta = {
      ready: false,
      lastError: 'Internet required to download map tiles.',
    };
    saveOfflineMapMeta(err);
    onProgress({
      done: 0,
      total: 0,
      percent: 0,
      approxBytes: 0,
      status: 'error',
      message: err.lastError,
    });
    return err;
  }

  await seedOfflineTripData();

  const swReady = await ensureServiceWorkerControl();
  if (!swReady && import.meta.env.PROD) {
    onProgress({
      done: 0,
      total: 0,
      percent: 0,
      approxBytes: 0,
      status: 'downloading',
      message:
        'Activating offline cache… reload once if tiles do not stay offline.',
    });
  }

  const { tiles, estimatedBytes } = planOfflineTiles();
  let done = 0;
  let okCount = 0;
  let cursor = 0;

  onProgress({
    done: 0,
    total: tiles.length,
    percent: 0,
    approxBytes: estimatedBytes,
    status: 'downloading',
    message: `Downloading ${tiles.length} tiles (~${formatBytes(estimatedBytes)})…`,
  });

  async function worker() {
    while (cursor < tiles.length) {
      if (signal?.aborted) throw new Error('Download cancelled');
      const i = cursor++;
      const tile = tiles[i];
      const ok = await prefetchTile(tile.url);
      if (ok) okCount++;
      done++;
      if (done % 5 === 0 || done === tiles.length) {
        onProgress({
          done,
          total: tiles.length,
          percent: Math.round((done / tiles.length) * 100),
          approxBytes: Math.round((okCount / Math.max(1, done)) * estimatedBytes),
          status: 'downloading',
          message: `${done}/${tiles.length} tiles`,
        });
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENT, tiles.length) },
    () => worker(),
  );

  try {
    await Promise.all(workers);

    // Best-effort count of cached tile entries
    let cached = okCount;
    try {
      const cache = await caches.open(TILE_CACHE_NAME);
      const keys = await cache.keys();
      cached = keys.length || okCount;
    } catch {
      // ignore
    }

    const meta: OfflineMapMeta = {
      ready: okCount > 0,
      downloadedAt: new Date().toISOString(),
      tileCount: cached,
      approxBytes: Math.round((okCount / Math.max(1, tiles.length)) * estimatedBytes),
      lastError:
        okCount === 0
          ? 'No tiles cached. Open the app once online, reload, then retry download (service worker must be active).'
          : undefined,
    };
    saveOfflineMapMeta(meta);
    onProgress({
      done: tiles.length,
      total: tiles.length,
      percent: 100,
      approxBytes: meta.approxBytes ?? 0,
      status: okCount > 0 ? 'done' : 'error',
      message: okCount > 0 ? 'Offline map ready' : meta.lastError,
    });
    return meta;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Download failed';
    const meta: OfflineMapMeta = {
      ready: loadOfflineMapMeta().ready,
      lastError: message,
    };
    saveOfflineMapMeta({ ...loadOfflineMapMeta(), lastError: message });
    onProgress({
      done,
      total: tiles.length,
      percent: Math.round((done / Math.max(1, tiles.length)) * 100),
      approxBytes: estimatedBytes,
      status: 'error',
      message,
    });
    return meta;
  }
}

export function buildTileUrl(z: number, x: number, y: number): string {
  return tileUrl(z, x, y);
}
