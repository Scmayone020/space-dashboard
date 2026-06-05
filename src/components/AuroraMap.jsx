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

const PDT_TZ = 'America/Los_Angeles'; // Bellevue / PST reference

function getChanceColor(chance) {
  if (chance >= 70) return '#4caf88';
  if (chance >= 30) return '#f0c040';
  if (chance >= 10) return '#f07020';
  return '#cc4444';
}

// Returns estimated arrival offset in hours (null = no specific ETA)
function getETAHours(kpNeeded, currentKp) {
  if (currentKp >= kpNeeded) return 0;
  const diff = kpNeeded - currentKp;
  if (diff <= 1) return 1.5;
  if (diff <= 2) return 4.5;
  return null;
}

// Format a future time in a given timezone
function formatLocalTime(hoursFromNow, tz) {
  const t = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  return t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
}

// Get UTC offset in hours for a timezone right now
function getUTCOffset(tz) {
  const now = new Date();
  const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', hour12: false });
  const tzStr  = now.toLocaleString('en-US', { timeZone: tz,  hour: 'numeric', hour12: false });
  return parseInt(tzStr) - parseInt(utcStr);
}

// Difference from PDT reference
function getPDTDiff(tz) {
  const pdtOffset = getUTCOffset(PDT_TZ);
  const cityOffset = getUTCOffset(tz);
  const diff = cityOffset - pdtOffset;
  if (diff === 0) return '—';
  return diff > 0 ? `+${diff}h from PDT` : `${diff}h from PDT`;
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
              <th>Est. Arrival (Local Time)</th>
              <th>vs PDT (Bellevue)</th>
            </tr>
          </thead>
          <tbody>
            {CITIES.map(city => {
              const color = getChanceColor(city.chance);
              const etaHours = getETAHours(city.kpNeeded, kpVal);
              const pdtDiff = getPDTDiff(city.tz);

              let etaDisplay, etaColor;
              if (etaHours === 0) {
                etaDisplay = `Now (${formatLocalTime(0, city.tz)})`;
                etaColor = '#4caf88';
              } else if (etaHours !== null) {
                etaDisplay = `~${formatLocalTime(etaHours, city.tz)} local`;
                etaColor = '#f0c040';
              } else if (city.kpNeeded - kpVal <= 3) {
                etaDisplay = 'Next storm';
                etaColor = '#f07020';
              } else {
                etaDisplay = 'Unlikely tonight';
                etaColor = '#cc4444';
              }

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
                  <td className="eta-cell" style={{ color: etaColor }}>{etaDisplay}</td>
                  <td className="pdt-diff">{pdtDiff}</td>
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
