import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Launchpads() {
  const [pads, setPads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/launchpads`)
      .then(r => r.json())
      .then(setPads)
      .catch(() => setError('Failed to load launchpad data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!pads.length) return <p className="loading">Loading launchpads...</p>;

  return (
    <div className="card launchpads">
      <h2>SpaceX Launchpads</h2>
      <ul>
        {pads.map(p => (
          <li key={p.id}>
            <div className="launch-name">{p.full_name}</div>
            <div className="launch-meta">
              <span className={`status ${p.status === 'active' ? 'success' : p.status === 'retired' ? 'failed' : 'pending'}`}>{p.status}</span>
              <span>{p.locality}, {p.region}</span>
              <span>{p.launch_successes}/{p.launch_attempts} successes</span>
            </div>
            {p.details && <p className="launch-details">{p.details}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
