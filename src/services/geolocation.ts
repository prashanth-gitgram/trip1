import type { Coordinates } from '../types/trip';
import { haversineKm } from '../data/routes';

export interface GeoPosition {
  coords: Coordinates;
  accuracyM: number;
  heading: number | null;
  timestamp: number;
}

export function getCurrentPosition(
  options?: PositionOptions,
): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          accuracyM: pos.coords.accuracy,
          heading: Number.isFinite(pos.coords.heading)
            ? pos.coords.heading
            : null,
          timestamp: pos.timestamp,
        });
      },
      (err) => reject(new Error(err.message || 'Unable to get location')),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        ...options,
      },
    );
  });
}

/** Initial bearing from A → B in degrees (0–360). */
export function bearingDegrees(from: Coordinates, to: Coordinates): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lng - from.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function formatBearing(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round(deg / 45) % 8;
  return `${dirs[i]} (${Math.round(deg)}°)`;
}

export function distanceToStop(
  from: Coordinates,
  to: Coordinates,
): { km: number; bearing: number } {
  return {
    km: Math.round(haversineKm(from, to) * 10) / 10,
    bearing: bearingDegrees(from, to),
  };
}
