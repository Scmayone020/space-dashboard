import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Cores() {
  const [cores, setCores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/cores`)
      .then(r => r.json())
      .then(data => setCores(data.slice(0, 8)))
      .catch(() => setError('Failed to load core data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!cores.length) return <p className="loading">Loading booster core data...</p>;

  return (
    <div className="card cores">
      <h2>SpaceX Booster Cores</h2>
      <ul>
        {cores.map(c => (
          <li key={c.id}>
            <div className="capsule-serial">{c.serial}</div>
            <div className="capsule-meta">
              <span className={`status ${c.status === 'active' ? 'success' : c.status === 'retired' ? 'failed' : 'pending'}`}>{c.status}</span>
              <span>Launches: {c.reuse_count + 1}</span>
              <span>RTLS: {c.rtls_landings}/{c.rtls_attempts}</span>
              <span>ASDS: {c.asds_landings}/{c.asds_attempts}</span>
            </div>
            {c.last_update && <p className="launch-details">{c.last_update}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
