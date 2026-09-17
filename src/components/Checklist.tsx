import { useEffect, useMemo, useState } from 'react';
import { CHECKLIST_ITEMS } from '../data/tripData';
import {
  loadChecklist,
  saveChecklist,
  type ChecklistState,
} from '../services/storage';

const CATEGORIES: {
  key: 'vehicle' | 'backpack' | 'before_leaving';
  title: string;
}[] = [
  { key: 'vehicle', title: 'Vehicle' },
  { key: 'backpack', title: 'Backpack' },
  { key: 'before_leaving', title: 'Before leaving' },
];

interface Props {
  onProgressChange?: (done: number, total: number) => void;
}

export function Checklist({ onProgressChange }: Props) {
  const [state, setState] = useState<ChecklistState>(() => loadChecklist());

  useEffect(() => {
    saveChecklist(state);
    const done = Object.values(state).filter(Boolean).length;
    onProgressChange?.(done, CHECKLIST_ITEMS.length);
  }, [state, onProgressChange]);

  const byCategory = useMemo(() => {
    return CATEGORIES.map((c) => ({
      ...c,
      items: CHECKLIST_ITEMS.filter((i) => i.category === c.key),
    }));
  }, []);

  function toggle(id: string) {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="rounded-2xl bg-surface/80 p-4 ring-1 ring-white/5">
      <h2 className="font-display text-lg text-cream">Checklist</h2>
      <p className="mt-1 text-xs text-muted">Saved on this device.</p>

      <div className="mt-4 space-y-5">
        {byCategory.map((cat) => (
          <div key={cat.key}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-moss-bright">
              {cat.title}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {cat.items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-ink/40">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-moss"
                      checked={!!state[item.id]}
                      onChange={() => toggle(item.id)}
                    />
                    <span
                      className={`text-sm ${
                        state[item.id] ? 'text-muted line-through' : 'text-cream'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
