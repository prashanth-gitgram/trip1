import { useEffect, useState } from 'react';

export function OfflineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        online
          ? 'bg-moss/20 text-moss-bright'
          : 'bg-amber-dim/30 text-sand'
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`h-2 w-2 rounded-full ${online ? 'bg-moss-bright' : 'bg-sand'}`}
      />
      {online ? 'ONLINE' : 'OFFLINE'}
      {!online && (
        <span className="font-normal text-muted">
          — trip data available
        </span>
      )}
    </div>
  );
}
