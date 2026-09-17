/** Optional weather slot — never required for core app. */
export function WeatherPanel() {
  const offline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <section className="rounded-2xl bg-surface/60 p-4 ring-1 ring-white/5">
      <h2 className="font-display text-lg text-cream">Weather</h2>
      <p className="mt-2 text-sm text-muted">
        {offline
          ? 'Weather unavailable offline'
          : 'Weather unavailable — optional online API not configured'}
      </p>
    </section>
  );
}
