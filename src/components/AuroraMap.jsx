import { useEffect, useState } from 'react';

const AURORA_POLL_MS = 30 * 60 * 1000;

const CITIES = [
  { name: 'Bellevue, WA',    lat: 47.6, kpNeeded: 5, chance: 15, tz: 'America/Los_Angeles' },
  { name: 'Washington DC',   lat: 38.9, kpNeeded: 7, chance: 3,  tz: 'America/New_York' },
  { name: 'Seattle, WA',     lat: 47.6, kpNeeded: 5, chance: 15, tz: 'America/Los_Angeles' },
  { name: 'New York, NY',    lat: 40.7, kpNeeded: 7, chance: 4,  tz: 'America/New_York' },
  { name: 'Chicago, IL',     lat: 41.8, kpNeeded: 6, chance: 8,  tz: 'America/Chicago' },
  { name: 'Minneapolis, MN', lat: 44.9, kpNeeded: 5, chance: 18, tz: 'America/Chicago' },
  { name: 'Anchorage, AK',   lat: 61.2, kpNeeded: 2, chance: 85, tz: 'America/Anchorage' },
  { name: 'Calgary, AB',     lat: 51.0, kpNeeded: 4, chance: 40, tz: 'America/Edmonton' },
];

function getChanceColor(chance) {
  if (chance >= 70) return '#4caf88';
  if (chance >= 30) return '#f0c040';
  if (chance >= 10) return '#f07020';
  return '#cc4444';
}

function getETA(kpNeeded, currentKp) {
  if (currentKp >= kpNeeded) return 'Visible Now';
  const diff = kpNeeded - currentKp;
  if (diff <= 1) return '~1–2 hrs';
  if (diff <= 2) return '~3–6 hrs';
  if (diff <= 3) return 'Next storm';
  return 'Unlikely tonight';
}

export default function AuroraMap({ kpVal = 1 }) {
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

      <div className="aurora-city-table">
        <h3>Aurora Visibility by City</h3>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Kp Needed</th>
              <th>Chance Tonight</th>
              <th>Est. Time of Arrival</th>
            </tr>
          </thead>
          <tbody>
            {CITIES.map(city => {
              const color = getChanceColor(city.chance);
              const eta = getETA(city.kpNeeded, kpVal);
              return (
                <tr key={city.name}>
                  <td className="city-name">{city.name}</td>
                  <td className="city-kp">Kp{city.kpNeeded}+</td>
                  <td>
                    <div className="chance-cell">
                      <div className="chance-bar-track">
                        <div className="chance-bar-fill" style={{ width: `${city.chance}%`, background: color }} />
                      </div>
                      <span className="chance-pct" style={{ color }}>{city.chance}%</span>
                    </div>
                  </td>
                  <td className="eta-cell" style={{ color }}>{eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="aurora-note">Green/yellow areas indicate where aurora is forecast to be visible. Brighter = stronger activity.</p>
    </div>
  );
}
