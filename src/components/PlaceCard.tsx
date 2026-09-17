import type { Place } from '../types/trip';
import {
  formatDistance,
  formatDriveTime,
} from '../data/routes';
import {
  googleMapsDirectionsUrl,
  googleMapsPlaceUrl,
} from '../services/navigation';
import { TYPE_COLORS, TYPE_LABELS } from '../utils/placeStyles';

interface Props {
  place: Place;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function PlaceCard({
  place,
  visited,
  onToggleVisited,
  selected,
  onSelect,
}: Props) {
  const navUrl = googleMapsDirectionsUrl(place.coordinates);
  const mapsUrl = googleMapsPlaceUrl(place.coordinates, place.name);
  const color = TYPE_COLORS[place.type];

  return (
    <article
      className={`rounded-2xl bg-surface/90 p-4 ring-1 transition ${
        selected ? 'ring-moss shadow-lg shadow-black/40' : 'ring-white/5'
      }`}
      onClick={() => onSelect?.(place.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-ink"
              style={{ backgroundColor: color }}
            >
              {place.order}
            </span>
            <h3 className="font-display text-base text-cream">{place.name}</h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            {TYPE_LABELS[place.type]} · Day {place.day}
            {place.verificationStatus === 'needs_verification' && (
              <span className="ml-2 text-sand">Needs verification</span>
            )}
            {place.verificationStatus === 'approximate' && (
              <span className="ml-2 text-muted">Approx. pin</span>
            )}
          </p>
        </div>
        <label
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="accent-moss"
            checked={visited}
            onChange={() => onToggleVisited(place.id)}
          />
          Visited
        </label>
      </div>

      <p className="mt-3 text-sm text-cream/90">{place.shortDescription}</p>
      <p className="mt-2 text-sm text-muted">
        <span className="text-moss-bright">Why visit:</span> {place.whyVisit}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">Time needed</dt>
          <dd className="text-cream">{place.approxTimeRequired}</dd>
        </div>
        <div>
          <dt className="text-muted">From previous</dt>
          <dd className="text-cream">
            {place.distanceFromPreviousKm == null
              ? '—'
              : `${formatDistance(place.distanceFromPreviousKm)} · ${formatDriveTime(place.driveTimeFromPreviousMin ?? 0)}`}
          </dd>
        </div>
      </dl>

      {place.notes && (
        <p className="mt-3 text-sm text-muted">{place.notes}</p>
      )}
      {place.openingInfo && (
        <p className="mt-2 text-xs text-sand">Hours: {place.openingInfo}</p>
      )}
      {place.safetyNote && (
        <p className="mt-3 rounded-xl border border-sand/30 bg-sand/10 px-3 py-2 text-xs text-sand">
          {place.safetyNote}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-moss px-3 py-2 text-sm font-semibold text-ink hover:bg-moss-bright"
          onClick={(e) => e.stopPropagation()}
        >
          Navigate
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-surface-2 px-3 py-2 text-sm font-semibold text-cream ring-1 ring-white/10 hover:bg-surface-3"
          onClick={(e) => e.stopPropagation()}
        >
          Open in Maps
        </a>
      </div>
    </article>
  );
}
