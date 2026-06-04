import { useEffect, useState } from 'react';

export default function Satellites() {
  const [sats, setSats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TLE API - fetch a group of satellites (ISS group)
    fetch('https://tle.ivanstanojevic.me/api/tle/?search=ISS&page-size=8')
      .then(r => r.json())
      .then(data => setSats(data.member?.slice(0, 8) || []))
      .catch(() => setError('Failed to load satellite TLE data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!sats.length) return <p className="loading">Loading satellite data...</p>;

  return (
    <div className="card satellites">
      <h2>Satellite Tracking (TLE Data)</h2>
      <ul>
        {sats.map(s => (
          <li key={s.satelliteId}>
            <div className="sat-name">{s.name}</div>
            <div className="sat-meta">
              <span>NORAD ID: {s.satelliteId}</span>
              <span>Updated: {new Date(s.date).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
