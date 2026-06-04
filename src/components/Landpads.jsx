import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Landpads() {
  const [pads, setPads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/landpads`)
      .then(r => r.json())
      .then(setPads)
      .catch(() => setError('Failed to load landing pad data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!pads.length) return <p className="loading">Loading landing pads...</p>;

  return (
    <div className="card landpads">
      <h2>SpaceX Landing Pads</h2>
      <ul>
        {pads.map(p => (
          <li key={p.id}>
            <div className="launch-name">{p.full_name} <span className="pad-name">({p.name})</span></div>
            <div className="launch-meta">
              <span className={`status ${p.status === 'active' ? 'success' : p.status === 'retired' ? 'failed' : 'pending'}`}>{p.status}</span>
              <span>{p.locality}, {p.region}</span>
              <span>{p.landing_successes}/{p.landing_attempts} landings</span>
            </div>
            {p.details && <p className="launch-details">{p.details}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
