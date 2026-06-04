import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Capsules() {
  const [capsules, setCapsules] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/capsules`)
      .then(r => r.json())
      .then(data => setCapsules(data.slice(0, 8)))
      .catch(() => setError('Failed to load capsule data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!capsules.length) return <p className="loading">Loading capsule data...</p>;

  return (
    <div className="card capsules">
      <h2>SpaceX Dragon Capsules</h2>
      <ul>
        {capsules.map(c => (
          <li key={c.id}>
            <div className="capsule-serial">{c.serial}</div>
            <div className="capsule-meta">
              <span className={`status ${c.status === 'active' ? 'success' : c.status === 'retired' ? 'failed' : 'pending'}`}>{c.status}</span>
              <span>Type: {c.type}</span>
              <span>Reuses: {c.reuse_count}</span>
              <span>Splashdowns: {c.water_landings}</span>
            </div>
            {c.last_update && <p className="launch-details">{c.last_update}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
