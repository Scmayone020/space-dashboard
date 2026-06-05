import { useEffect, useState } from 'react';

export default function Satellites() {
  const [sats, setSats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // celestrak.org is the authoritative public TLE source
    fetch('https://celestrak.org/SOCRATES/query.php?CODE=ISS&TCA=2026-06-01&DAYS=3&MAX=10&TYPE=JSON&format=json')
      .then(r => r.json())
      .then(data => setSats(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {
        // Fallback: use celestrak TLE text format
        fetch('https://celestrak.org/SOCRATES/query.php?CODE=25544&format=json')
          .then(r => r.json())
          .then(data => setSats(Array.isArray(data) ? data.slice(0, 8) : []))
          .catch(() => setError('Failed to load satellite TLE data'));
      });
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
