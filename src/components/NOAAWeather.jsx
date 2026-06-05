import { useEffect, useState } from 'react';

export default function NOAAWeather() {
  const [alerts, setAlerts] = useState([]);
  const [solarWind, setSolarWind] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Active alerts
    fetch('https://services.swpc.noaa.gov/products/alerts.json')
      .then(r => r.json())
      .then(data => setAlerts(data.slice(0, 6)))
      .catch(() => setError('Failed to load NOAA alerts'));

    // Solar wind speed
    fetch('https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json')
      .then(r => r.json())
      .then(data => {
        const latest = data[data.length - 1];
        setSolarWind(latest);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="card noaa-weather">
      <h2>NOAA Space Weather Alerts</h2>

      {solarWind && (
        <div className="solar-wind-bar">
          <span>Solar Wind Speed: <strong>{Math.round(solarWind.proton_speed || solarWind.speed || 0)} km/s</strong></span>
          <span>Density: <strong>{parseFloat(solarWind.proton_density || 0).toFixed(1)} p/cm³</strong></span>
          <span>Updated: {new Date(solarWind.time_tag).toLocaleTimeString()}</span>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {!alerts.length && !error && <p className="loading">Loading space weather alerts...</p>}

      <ul>
        {alerts.map((a, i) => {
          const isWarning = a.message?.toLowerCase().includes('warning');
          const isWatch = a.message?.toLowerCase().includes('watch');
          const severity = isWarning ? 'failed' : isWatch ? 'pending' : 'success';
          const lines = a.message?.split('\n').filter(Boolean) || [];
          const title = lines[0] || 'Alert';
          const body = lines.slice(1, 4).join(' ');
          return (
            <li key={i}>
              <div className="alert-row">
                <span className={`status ${severity}`}>{isWarning ? 'Warning' : isWatch ? 'Watch' : 'Info'}</span>
                <span className="event-date">{new Date(a.issue_datetime).toLocaleString()}</span>
              </div>
              <div className="event-type">{title}</div>
              {body && <p className="event-body">{body}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
