import type { DayId } from '../types/trip';

const DAYS: { id: DayId; label: string }[] = [
  { id: 1, label: 'DAY 1' },
  { id: 2, label: 'DAY 2' },
  { id: 3, label: 'DAY 3' },
  { id: 4, label: 'DAY 4' },
  { id: 'full', label: 'FULL TRIP' },
];

interface Props {
  selected: DayId;
  onSelect: (day: DayId) => void;
  compact?: boolean;
}

export function DaySelector({ selected, onSelect, compact }: Props) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 ${compact ? '' : 'scrollbar-thin'}`}
      role="tablist"
      aria-label="Trip day"
    >
      {DAYS.map((d) => {
        const active = selected === d.id;
        return (
          <button
            key={String(d.id)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(d.id)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold tracking-wide transition ${
              active
                ? 'bg-moss text-ink shadow-md shadow-black/30'
                : 'bg-surface-2 text-muted hover:bg-surface-3 hover:text-cream'
            }`}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
