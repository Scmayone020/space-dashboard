import { useEffect, useState } from 'react';

const INTERVAL_MS = 45 * 60 * 1000; // 45 minutes
const MAX_REFRESHES = 4; // 3 hours total (4 x 45min)

export default function RefreshTimer({ onRefresh, refreshCount }) {
  const [secondsLeft, setSecondsLeft] = useState(INTERVAL_MS / 1000);
  const [nextRefresh, setNextRefresh] = useState(new Date(Date.now() + INTERVAL_MS));

  useEffect(() => {
    if (refreshCount >= MAX_REFRESHES) return;

    setSecondsLeft(INTERVAL_MS / 1000);
    setNextRefresh(new Date(Date.now() + INTERVAL_MS));

    const countdown = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    const refresh = setTimeout(() => {
      onRefresh();
    }, INTERVAL_MS);

    return () => {
      clearInterval(countdown);
      clearTimeout(refresh);
    };
  }, [refreshCount]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = ((INTERVAL_MS / 1000 - secondsLeft) / (INTERVAL_MS / 1000)) * 100;
  const done = refreshCount >= MAX_REFRESHES;

  return (
    <div className="refresh-timer">
      <div className="refresh-left">
        <span className="refresh-icon">🔄</span>
        <div>
          <div className="refresh-label">
            {done
              ? '✓ Session complete — 3 hours of monitoring finished'
              : `Next refresh in ${mins}:${String(secs).padStart(2, '0')}`}
          </div>
          <div className="refresh-meta">
            {done
              ? `Refreshed ${refreshCount} times over 3 hours`
              : `Refresh ${refreshCount + 1} of ${MAX_REFRESHES} — next at ${nextRefresh.toLocaleTimeString()}`}
          </div>
        </div>
      </div>
      {!done && (
        <div className="refresh-right">
          <div className="refresh-bar-track">
            <div className="refresh-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <button className="refresh-now-btn" onClick={onRefresh}>Refresh Now</button>
        </div>
      )}
    </div>
  );
}
