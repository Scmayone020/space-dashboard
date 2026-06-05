import { useEffect, useState } from 'react';

const KP_LABELS = ['', '', 'Quiet', 'Unsettled', 'Active', 'Minor Storm', 'Moderate Storm', 'Strong Storm', 'Severe Storm', 'Extreme Storm'];
const KP_COLORS = ['#4caf88', '#4caf88', '#4caf88', '#f0c040', '#f0a020', '#f07020', '#e05030', '#cc2020', '#aa0000', '#880000'];

export default function StormAlert() {
  const [kp, setKp] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Current Kp index (1-minute data)
    fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json')
      .then(r => r.json())
      .then(data => {
        const latest = data[data.length - 1];
        setKp(latest);
      })
      .catch(() => setError('Failed to load Kp data'));

    // 3-day Kp forecast
    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json')
      .then(r => r.json())
      .then(data => {
        // Skip header row, get next 24 entries
        const rows = data.slice(1, 25);
        setForecast(rows);
      })
      .catch(() => {});
  }, []);

  if (error) return null;
  if (!kp) return null;

  const kpVal = Math.round(parseFloat(kp.kp_index || kp.Kp || 0));
  const color = KP_COLORS[Math.min(kpVal, 9)] || '#4caf88';
  const label = KP_LABELS[Math.min(kpVal, 9)] || 'Quiet';
  const isStorm = kpVal >= 5;

  return (
    <div className={`storm-alert-banner ${isStorm ? 'stormy' : 'calm'}`} style={{ borderColor: color }}>
      <div className="storm-kp-main">
        <div className="kp-circle" style={{ background: color }}>
          <span className="kp-value">Kp{kpVal}</span>
        </div>
        <div className="storm-info">
          <div className="storm-label" style={{ color }}>{label}</div>
          <div className="storm-time">Current geomagnetic activity — updated {new Date(kp.time_tag).toLocaleTimeString()}</div>
          {isStorm && <div className="storm-warning">⚠ Geomagnetic storm in progress — aurora may be visible at lower latitudes</div>}
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="kp-forecast">
          <div className="forecast-label">24-Hour Kp Forecast</div>
          <div className="forecast-bars">
            {forecast.slice(0, 12).map((row, i) => {
              const val = Math.round(parseFloat(row[1] || 0));
              const h = Math.max(10, (val / 9) * 60);
              const c = KP_COLORS[Math.min(val, 9)];
              return (
                <div key={i} className="forecast-bar-wrap" title={`${row[0]}: Kp${val}`}>
                  <div className="forecast-bar" style={{ height: h, background: c }} />
                  <div className="forecast-time">{new Date(row[0]).getHours()}h</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
