import { useMemo } from 'react';
import { TRIP_META } from '../data/tripData';
import { formatDistance, formatDriveTime, fullTripTotals } from '../data/routes';
import { PLACES } from '../data/places';
import type { OfflineMapMeta } from '../services/storage';
import { formatBytes } from '../services/offlineMaps';

interface Props {
  checklistDone: number;
  checklistTotal: number;
  offlineMeta: OfflineMapMeta;
  visitedCount: number;
}

export function TripSummary({
  checklistDone,
  checklistTotal,
  offlineMeta,
  visitedCount,
}: Props) {
  const totals = useMemo(() => fullTripTotals(), []);

  return (
    <section className="rounded-2xl bg-surface/80 p-4 ring-1 ring-white/5">
      <h2 className="font-display text-lg text-cream">Trip summary</h2>
      <p className="mt-1 text-sm text-muted">{TRIP_META.datesLabel}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Stat label="Days" value={String(TRIP_META.days)} />
        <Stat label="Nights" value={String(TRIP_META.nights)} />
        <Stat label="Stays" value={String(TRIP_META.staysCount)} />
        <Stat label="Stops" value={String(PLACES.length)} />
        <Stat
          label="Est. drive"
          value={formatDistance(totals.distanceKm)}
          hint="road-adjusted estimate"
        />
        <Stat
          label="Est. time"
          value={formatDriveTime(totals.driveTimeMin)}
          hint="estimate only"
        />
        <Stat
          label="Visited"
          value={`${visitedCount}/${PLACES.length}`}
        />
        <Stat
          label="Checklist"
          value={`${checklistDone}/${checklistTotal}`}
        />
        <Stat
          label="Offline map"
          value={
            offlineMeta.ready
              ? 'Ready'
              : 'Not downloaded'
          }
          hint={
            offlineMeta.approxBytes
              ? formatBytes(offlineMeta.approxBytes)
              : undefined
          }
        />
      </dl>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-ink/40 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-cream">{value}</dd>
      {hint && <p className="text-[10px] text-muted/80">{hint}</p>}
    </div>
  );
}
