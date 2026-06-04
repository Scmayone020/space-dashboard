import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/launches/upcoming`)
      .then(r => r.json())
      .then(data => setLaunches(data.slice(0, 5)))
      .catch(() => setError('Failed to load launches'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!launches.length) return <p className="loading">Loading upcoming launches...</p>;

  return (
    <div className="card launches">
      <h2>Upcoming SpaceX Launches</h2>
      <ul>
        {launches.map(launch => (
          <li key={launch.id}>
            <div className="launch-name">{launch.name}</div>
            <div className="launch-meta">
              <span>{launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'TBD'}</span>
              <span className={`status ${launch.success === null ? 'pending' : launch.success ? 'success' : 'failed'}`}>
                {launch.success === null ? 'Upcoming' : launch.success ? 'Success' : 'Failed'}
              </span>
            </div>
            {launch.details && <p className="launch-details">{launch.details}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
