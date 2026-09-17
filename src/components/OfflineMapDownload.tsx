import { useMemo, useRef, useState } from 'react';
import {
  downloadOfflineTripArea,
  formatBytes,
  planOfflineTiles,
  type DownloadProgress,
} from '../services/offlineMaps';
import type { OfflineMapMeta } from '../services/storage';

interface Props {
  meta: OfflineMapMeta;
  onMetaChange: (meta: OfflineMapMeta) => void;
}

export function OfflineMapDownload({ meta, onMetaChange }: Props) {
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const plan = useMemo(() => planOfflineTiles(), []);

  async function start() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const result = await downloadOfflineTripArea(setProgress, ac.signal);
    onMetaChange(result);
  }

  const downloading = progress?.status === 'downloading';

  return (
    <section className="rounded-2xl bg-surface/80 p-4 ring-1 ring-white/5">
      <h2 className="font-display text-lg text-cream">Offline maps</h2>
      <p className="mt-1 text-sm text-muted">
        Caches OpenStreetMap tiles for this trip corridor (z8–11) and the hills
        focus area (z12–14) via the installable PWA service worker. Use a
        production build or GitHub Pages (not plain <code className="text-sand">npm run dev</code>)
        so the service worker is active. Personal use only — see OSM tile usage
        policy.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>~{plan.tiles.length} tiles</span>
        <span>·</span>
        <span>~{formatBytes(plan.estimatedBytes)}</span>
        {meta.ready && (
          <>
            <span>·</span>
            <span className="font-semibold text-moss-bright">
              Offline map ready
            </span>
          </>
        )}
      </div>

      {progress && progress.status === 'downloading' && (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-ink">
            <div
              className="h-full bg-moss transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            {progress.message} · {progress.percent}%
          </p>
        </div>
      )}

      {progress?.status === 'error' && (
        <p className="mt-2 text-xs text-sand">{progress.message}</p>
      )}

      <button
        type="button"
        disabled={downloading}
        onClick={start}
        className="mt-4 w-full rounded-xl bg-sand px-4 py-3 text-sm font-bold tracking-wide text-ink disabled:opacity-60 sm:w-auto"
      >
        {downloading
          ? 'Downloading…'
          : meta.ready
            ? 'Re-download Offline Trip Area'
            : 'Download Offline Trip Area'}
      </button>
    </section>
  );
}
