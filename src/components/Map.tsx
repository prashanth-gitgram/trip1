import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type { DayId, Place } from '../types/trip';
import { placesWithLegEstimates, routeCoordinatesForDay } from '../data/routes';
import { OfflineTileLayer } from './OfflineTileLayer';
import { TYPE_COLORS, markerSymbol } from '../utils/placeStyles';
import {
  distanceToStop,
  formatBearing,
  getCurrentPosition,
  type GeoPosition,
} from '../services/geolocation';
import { googleMapsDirectionsUrl } from '../services/navigation';

import 'leaflet/dist/leaflet.css';

interface Props {
  day: DayId;
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
}

function FitBounds({
  positions,
  trigger,
}: {
  positions: [number, number][];
  trigger: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [map, positions, trigger]);
  return null;
}

function MapCamera({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.setView([target.lat, target.lng], target.zoom);
  }, [map, target]);
  return null;
}

function makeIcon(place: Place, selected: boolean) {
  const color = TYPE_COLORS[place.type];
  const size = selected ? 36 : 30;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};color:#141a14;font-weight:700;font-size:12px;
      display:flex;align-items:center;justify-content:center;
      border:2px solid ${selected ? '#e8ebe4' : 'rgba(20,26,20,0.7)'};
      box-shadow:0 2px 8px rgba(0,0,0,0.45);
      font-family:system-ui,sans-serif;
    ">${place.order}<span style="font-size:9px;margin-left:1px;opacity:.85">${markerSymbol(place.type)}</span></div>
  `;
  return L.divIcon({
    className: '',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export function TripMap({ day, selectedPlaceId, onSelectPlace }: Props) {
  const places = useMemo(() => placesWithLegEstimates(day), [day]);
  const route = useMemo(() => routeCoordinatesForDay(day), [day]);
  const positions = useMemo(
    () => route.map((c) => [c.lat, c.lng] as [number, number]),
    [route],
  );
  const [fitKey, setFitKey] = useState(0);
  const [geo, setGeo] = useState<GeoPosition | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [camera, setCamera] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);

  const nearInfo = useMemo(() => {
    if (!geo || places.length === 0) return null;
    const target =
      places.find((p) => p.id === selectedPlaceId) ?? places[0];
    if (!target) return null;
    const d = distanceToStop(geo.coords, target.coordinates);
    return { target, ...d };
  }, [geo, places, selectedPlaceId]);

  const locate = useCallback(async () => {
    setGeoLoading(true);
    setGeoError(null);
    try {
      const pos = await getCurrentPosition();
      setGeo(pos);
      setCamera({ lat: pos.coords.lat, lng: pos.coords.lng, zoom: 12 });
    } catch (e) {
      setGeoError(e instanceof Error ? e.message : 'Location unavailable');
    } finally {
      setGeoLoading(false);
    }
  }, []);

  useEffect(() => {
    setFitKey((k) => k + 1);
  }, [day]);

  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
      <MapContainer
        center={[10.25, 77.45]}
        zoom={9}
        className="h-full w-full bg-ink"
        zoomControl={false}
      >
        <OfflineTileLayer />
        <FitBounds positions={positions} trigger={fitKey} />
        <MapCamera target={camera} />
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#7a9e6a',
              weight: 4,
              opacity: 0.85,
              lineJoin: 'round',
            }}
          />
        )}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={makeIcon(place, place.id === selectedPlaceId)}
            eventHandlers={{
              click: () => onSelectPlace(place.id),
            }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              <span style={{ fontSize: 12 }}>{place.shortDescription}</span>
              <br />
              <a
                href={googleMapsDirectionsUrl(place.coordinates)}
                target="_blank"
                rel="noreferrer"
              >
                Navigate
              </a>
            </Popup>
          </Marker>
        ))}
        {geo && (
          <CircleMarker
            center={[geo.coords.lat, geo.coords.lng]}
            radius={8}
            pathOptions={{
              color: '#e8ebe4',
              fillColor: '#5dade2',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>You are here (±{Math.round(geo.accuracyM)} m)</Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between gap-2 p-3">
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={locate}
            className="rounded-xl bg-ink/85 px-3 py-2 text-xs font-semibold text-cream shadow-lg ring-1 ring-white/10 backdrop-blur hover:bg-ink"
          >
            {geoLoading ? 'Locating…' : 'Where am I?'}
          </button>
          <button
            type="button"
            onClick={() => setFitKey((k) => k + 1)}
            className="rounded-xl bg-ink/85 px-3 py-2 text-xs font-semibold text-cream shadow-lg ring-1 ring-white/10 backdrop-blur hover:bg-ink"
          >
            Fit route
          </button>
        </div>
        {(geoError || nearInfo) && (
          <div className="pointer-events-auto max-w-[200px] rounded-xl bg-ink/85 px-3 py-2 text-xs text-cream shadow-lg ring-1 ring-white/10 backdrop-blur">
            {geoError && <p className="text-sand">{geoError}</p>}
            {nearInfo && (
              <p>
                To {nearInfo.target.name}: ~{nearInfo.km} km ·{' '}
                {formatBearing(nearInfo.bearing)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-2 left-2 right-2 text-[10px] text-cream/70">
        <span className="rounded bg-ink/70 px-1.5 py-0.5">
          Map data © OpenStreetMap contributors
        </span>
      </div>
    </div>
  );
}
