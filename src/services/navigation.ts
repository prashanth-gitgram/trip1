import type { Coordinates } from '../types/trip';

/** Google Maps directions — no API key required. */
export function googleMapsDirectionsUrl(
  destination: Coordinates,
  origin?: Coordinates,
): string {
  const dest = `${destination.lat},${destination.lng}`;
  if (origin) {
    const o = `${origin.lat},${origin.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`;
}

/** Open place pin in Google Maps. */
export function googleMapsPlaceUrl(coords: Coordinates, label?: string): string {
  const q = label
    ? `${label}@${coords.lat},${coords.lng}`
    : `${coords.lat},${coords.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** geo: URI for native maps apps where supported. */
export function geoUri(coords: Coordinates, label?: string): string {
  const suffix = label ? `(${encodeURIComponent(label)})` : '';
  return `geo:${coords.lat},${coords.lng}?q=${coords.lat},${coords.lng}${suffix}`;
}
