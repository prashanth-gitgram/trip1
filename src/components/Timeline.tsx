import { useEffect, useState } from 'react';
import type { DayId, TimelineItem } from '../types/trip';
import { loadTimeline, saveTimeline } from '../services/storage';

interface Props {
  day: DayId;
}

export function Timeline({ day }: Props) {
  const [items, setItems] = useState<TimelineItem[]>(() => loadTimeline());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    saveTimeline(items);
  }, [items]);

  const visible =
    day === 'full'
      ? items
      : items.filter((i) => i.day === day);

  function updateTime(id: string, timeLabel: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, timeLabel } : i)),
    );
  }

  if (visible.length === 0) {
    return (
      <p className="text-sm text-muted">No timeline items for this day.</p>
    );
  }

  return (
    <section className="rounded-2xl bg-surface/80 p-4 ring-1 ring-white/5">
      <h2 className="font-display text-lg text-cream">Timeline</h2>
      <p className="mt-1 text-xs text-muted">
        Tap a time to edit. Changes stay on this device.
      </p>
      <ol className="mt-4 space-y-0">
        {visible.map((item, idx) => (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {idx < visible.length - 1 && (
              <span
                className="absolute left-[11px] top-6 bottom-0 w-px bg-moss/40"
                aria-hidden
              />
            )}
            <span className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-moss ring-4 ring-ink" />
            <div className="min-w-0 flex-1">
              {editingId === item.id ? (
                <input
                  autoFocus
                  className="w-full rounded-lg bg-ink px-2 py-1 text-sm text-sand outline-none ring-1 ring-moss"
                  value={item.timeLabel}
                  onChange={(e) => updateTime(item.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingId(null);
                  }}
                  aria-label="Edit time"
                />
              ) : (
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-sand hover:underline"
                  onClick={() => setEditingId(item.id)}
                >
                  {item.timeLabel}
                </button>
              )}
              <p className="font-medium text-cream">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted">{item.description}</p>
              )}
              {day === 'full' && (
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-moss-bright/80">
                  Day {item.day}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
