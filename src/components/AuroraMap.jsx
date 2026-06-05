import { useEffect, useState } from 'react';

const AURORA_POLL_MS = 30 * 60 * 1000; // 30 minutes

export default function AuroraMap() {
  const [cacheBust, setCacheBust] = useState(Date.now());
  const [updated, setUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheBust(Date.now());
      setUpdated(new Date().toLocaleTimeString());
    }, AURORA_POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const northUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${cacheBust}`;
  const southUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg?t=${cacheBust}`;

  return (
    <div className="card aurora-map">
      <h2>Aurora Forecast Oval (NOAA)</h2>
      <p className="date"><span className="live-dot" /> Live — last refreshed at {updated} · auto-updates every 30 min</p>
      <div className="aurora-grid">
        <div className="aurora-hemisphere">
          <h3>Northern Hemisphere</h3>
          <img src={northUrl} alt="Northern hemisphere aurora forecast" />
        </div>
        <div className="aurora-hemisphere">
          <h3>Southern Hemisphere</h3>
          <img src={southUrl} alt="Southern hemisphere aurora forecast" />
        </div>
      </div>
      <p className="aurora-note">Green/yellow areas indicate where aurora is forecast to be visible. Brighter = stronger activity.</p>
    </div>
  );
}
