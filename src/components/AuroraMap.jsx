import { useEffect, useState } from 'react';

export default function AuroraMap() {
  const [updated, setUpdated] = useState(null);
  // NOAA aurora forecast oval images — updated every 30 minutes
  const northUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${Date.now()}`;
  const southUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg?t=${Date.now()}`;

  useEffect(() => {
    setUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="card aurora-map">
      <h2>Aurora Forecast Oval (NOAA)</h2>
      {updated && <p className="date">Loaded at {updated} — images update every 30 min</p>}
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
