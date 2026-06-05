import { useEffect, useState } from 'react';

const AURORA_POLL_MS = 30 * 60 * 1000;

// Polar azimuthal equidistant projection — pole at center, ~30°N at edge
// angle = degrees clockwise from top (0° = 0°E longitude)
function polarPos(lat, lonWest) {
  const maxCoLat = 60; // 30°N at edge
  const r = ((90 - lat) / maxCoLat) * 49; // % from center
  const angle = ((360 - lonWest) * Math.PI) / 180;
  return {
    left: `${(50 + r * Math.sin(angle)).toFixed(1)}%`,
    top:  `${(50 - r * Math.cos(angle)).toFixed(1)}%`,
  };
}

const NORTH_CITIES = [
  { name: 'Bellevue', lat: 47.6, lon: 122.3, chance: '~15%' },
  { name: 'Washington DC', lat: 38.9, lon: 77.0, chance: '~3%' },
];

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
          <div className="map-wrap">
            <img src={northUrl} alt="Northern hemisphere aurora forecast" />
            {NORTH_CITIES.map(city => {
              const pos = polarPos(city.lat, city.lon);
              return (
                <div key={city.name} className="city-pin" style={{ left: pos.left, top: pos.top }}>
                  <div className="pin-dot" />
                  <div className="pin-label">
                    <span className="pin-name">{city.name}</span>
                    <span className="pin-chance">{city.chance}</span>
                  </div>
                </div>
              );
            })}
          </div>
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
