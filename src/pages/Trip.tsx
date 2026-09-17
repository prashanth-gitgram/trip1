import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DayId } from '../types/trip';
import { TRIP_META, STAYS } from '../data/tripData';
import { DAY_SUMMARIES, formatDistance, formatDriveTime } from '../data/routes';
import { placesWithLegEstimates } from '../data/routes';
import { DaySelector } from '../components/DaySelector';
import { TripMap } from '../components/Map';
import { PlaceCard } from '../components/PlaceCard';
import { Timeline } from '../components/Timeline';
import { Checklist } from '../components/Checklist';
import { TripSummary } from '../components/TripSummary';
import { OfflineStatus } from '../components/OfflineStatus';
import { OfflineMapDownload } from '../components/OfflineMapDownload';
import { WeatherPanel } from '../components/WeatherPanel';
import {
  loadOfflineMapMeta,
  loadVisited,
  saveVisited,
  seedOfflineTripData,
  type OfflineMapMeta,
  type VisitedState,
} from '../services/storage';
import { CHECKLIST_ITEMS } from '../data/tripData';

export function TripPage() {
  const [day, setDay] = useState<DayId>(1);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [visited, setVisited] = useState<VisitedState>(() => loadVisited());
  const [offlineMeta, setOfflineMeta] = useState<OfflineMapMeta>(() =>
    loadOfflineMapMeta(),
  );
  const [checklistProgress, setChecklistProgress] = useState({
    done: 0,
    total: CHECKLIST_ITEMS.length,
  });

  useEffect(() => {
    void seedOfflineTripData();
  }, []);

  useEffect(() => {
    saveVisited(visited);
  }, [visited]);

  const places = useMemo(() => placesWithLegEstimates(day), [day]);

  useEffect(() => {
    setSelectedPlaceId(places[0]?.id ?? null);
  }, [day, places]);

  const daySummary = day === 'full' ? null : DAY_SUMMARIES[day - 1];

  const dayTotals = useMemo(() => {
    if (day === 'full') {
      const dist = places.reduce(
        (s, p) => s + (p.distanceFromPreviousKm ?? 0),
        0,
      );
      const time = places.reduce(
        (s, p) => s + (p.driveTimeFromPreviousMin ?? 0),
        0,
      );
      return {
        distanceKm: Math.round(dist * 10) / 10,
        driveTimeMin: time,
      };
    }
    return {
      distanceKm: daySummary?.totalDistanceKm ?? 0,
      driveTimeMin: daySummary?.totalDriveTimeMin ?? 0,
    };
  }, [day, daySummary, places]);

  const onChecklistProgress = useCallback((done: number, total: number) => {
    setChecklistProgress({ done, total });
  }, []);

  function toggleVisited(id: string) {
    setVisited((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const visitedCount = Object.values(visited).filter(Boolean).length;

  function scrollToOffline() {
    document.getElementById('offline-maps')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="min-h-dvh bg-ink text-cream">
      {/* Atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(122,158,106,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(196,163,90,0.12), transparent 50%), linear-gradient(180deg, #141a14 0%, #1a2218 40%, #121612 100%)',
        }}
      />

      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <p className="font-display text-sm tracking-wide text-moss-bright">
            Trailbook
          </p>
          <OfflineStatus />
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
          {TRIP_META.datesLabel}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-cream sm:text-5xl md:text-6xl">
          {TRIP_META.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          {TRIP_META.subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <DaySelector selected={day} onSelect={setDay} />
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={scrollToOffline}
            className="rounded-xl bg-sand px-4 py-3 text-sm font-bold tracking-wide text-ink"
          >
            Download Offline Map
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {STAYS.map((s) => (
            <span key={s.id}>
              Stay: <span className="text-cream">{s.name}</span> (
              {s.nights.length} night{s.nights.length > 1 ? 's' : ''})
            </span>
          ))}
        </div>
      </section>

      {/* Main composition: itinerary + map */}
      <main className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 lg:grid-cols-12 lg:gap-6">
        {/* Mobile day strip already in hero; map first on mobile after selector */}
        <div className="order-1 h-[55vh] min-h-[300px] lg:order-2 lg:col-span-7 lg:h-[calc(100dvh-6rem)] lg:sticky lg:top-4">
          <TripMap
            day={day}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
          />
        </div>

        <aside className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-5 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-2xl bg-surface/80 p-4 ring-1 ring-white/5">
            <h2 className="font-display text-xl text-cream">
              {day === 'full'
                ? 'Full trip loop'
                : daySummary?.title ?? `Day ${day}`}
            </h2>
            {day === 'full' ? (
              <p className="mt-1 text-sm text-muted">
                Outbound — Erode / Palani · Return — Dindigul / Salem
              </p>
            ) : (
              daySummary && (
                <>
                  <p className="mt-1 text-sm font-semibold text-moss-bright">
                    {daySummary.routeLabel}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{daySummary.subtitle}</p>
                </>
              )
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-lg bg-ink/50 px-2.5 py-1 text-sand">
                {formatDistance(dayTotals.distanceKm)}
              </span>
              <span className="rounded-lg bg-ink/50 px-2.5 py-1 text-sand">
                {formatDriveTime(dayTotals.driveTimeMin)}
              </span>
              <span className="rounded-lg bg-ink/50 px-2.5 py-1 text-muted">
                {places.length} stops
              </span>
            </div>
            {day !== 'full' && daySummary?.notes && (
              <p className="mt-3 text-sm text-muted">{daySummary.notes}</p>
            )}
            <p className="mt-2 text-[11px] text-muted/70">
              Distances and times are road-adjusted estimates from stored
              coordinates — not live routing.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-cream">Stops</h2>
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                visited={!!visited[place.id]}
                onToggleVisited={toggleVisited}
                selected={selectedPlaceId === place.id}
                onSelect={setSelectedPlaceId}
              />
            ))}
          </div>

          <Timeline day={day} />
          <Checklist onProgressChange={onChecklistProgress} />
          <WeatherPanel />
          <div id="offline-maps">
            <OfflineMapDownload
              meta={offlineMeta}
              onMetaChange={setOfflineMeta}
            />
          </div>
          <TripSummary
            checklistDone={checklistProgress.done}
            checklistTotal={checklistProgress.total}
            offlineMeta={offlineMeta}
            visitedCount={visitedCount}
          />

          <footer className="pb-8 text-xs text-muted">
            <p>
              Map tiles ©{' '}
              <a
                className="underline hover:text-cream"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
              >
                OpenStreetMap
              </a>{' '}
              contributors. Offline caching is for personal trip use within a
              limited bounding box; respect the{' '}
              <a
                className="underline hover:text-cream"
                href="https://operations.osmfoundation.org/policies/tiles/"
                target="_blank"
                rel="noreferrer"
              >
                OSM tile usage policy
              </a>
              .
            </p>
            <p className="mt-2">
              Coordinates live in{' '}
              <code className="text-sand">src/data/places.ts</code> (
              <code className="text-sand">COORDINATE_CONFIG</code>). Update
              lodging pins before relying on navigation.
            </p>
          </footer>
        </aside>
      </main>
    </div>
  );
}
