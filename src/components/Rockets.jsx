import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Rockets() {
  const [rockets, setRockets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/rockets`)
      .then(r => r.json())
      .then(setRockets)
      .catch(() => setError('Failed to load rockets'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!rockets.length) return <p className="loading">Loading rockets...</p>;

  return (
    <div className="card rockets">
      <h2>SpaceX Rockets</h2>
      <ul>
        {rockets.map(r => (
          <li key={r.id}>
            <div className="rocket-name">{r.name}</div>
            <div className="rocket-meta">
              <span>{r.active ? '🟢 Active' : '🔴 Retired'}</span>
              <span>Success rate: {r.success_rate_pct}%</span>
              <span>Cost/launch: ${r.cost_per_launch.toLocaleString()}</span>
            </div>
            <p>{r.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
