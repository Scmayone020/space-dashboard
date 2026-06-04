import { useEffect, useState } from 'react';
import { NASA_BASE, NASA_API_KEY } from '../config';

export default function Asteroids() {
  const [asteroids, setAsteroids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetch(`${NASA_BASE}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const all = Object.values(data.near_earth_objects).flat();
        setAsteroids(all.slice(0, 6));
      })
      .catch(() => setError('Failed to load asteroid data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!asteroids.length) return <p className="loading">Loading near-Earth asteroids...</p>;

  return (
    <div className="card asteroids">
      <h2>Near-Earth Asteroids Today</h2>
      <ul>
        {asteroids.map(a => (
          <li key={a.id}>
            <div className="asteroid-name">{a.name}</div>
            <div className="asteroid-meta">
              <span>Diameter: {Math.round(a.estimated_diameter.meters.estimated_diameter_max)}m</span>
              <span className={`hazard ${a.is_potentially_hazardous_asteroid ? 'dangerous' : 'safe'}`}>
                {a.is_potentially_hazardous_asteroid ? '⚠ Hazardous' : '✓ Safe'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
