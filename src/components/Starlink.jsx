import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Starlink() {
  const [sats, setSats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/starlink`)
      .then(r => r.json())
      .then(data => {
        const active = data.filter(s => s.spaceTrack?.OBJECT_NAME);
        setSats(active.slice(0, 8));
      })
      .catch(() => setError('Failed to load Starlink data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!sats.length) return <p className="loading">Loading Starlink satellites...</p>;

  return (
    <div className="card starlink">
      <h2>Starlink Satellites</h2>
      <p className="starlink-count">Showing 8 of {sats.length}+ satellites</p>
      <ul>
        {sats.map(s => (
          <li key={s.id}>
            <div className="sat-name">{s.spaceTrack?.OBJECT_NAME}</div>
            <div className="sat-meta">
              <span>Launch: {s.launch}</span>
              {s.latitude && <span>Lat: {s.latitude?.toFixed(2)}°</span>}
              {s.longitude && <span>Lon: {s.longitude?.toFixed(2)}°</span>}
              {s.height_km && <span>Alt: {s.height_km?.toFixed(0)} km</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
