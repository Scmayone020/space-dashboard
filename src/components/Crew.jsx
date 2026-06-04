import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Crew() {
  const [crew, setCrew] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/crew`)
      .then(r => r.json())
      .then(setCrew)
      .catch(() => setError('Failed to load crew data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!crew.length) return <p className="loading">Loading crew data...</p>;

  return (
    <div className="card crew">
      <h2>SpaceX Crew Members</h2>
      <div className="crew-grid">
        {crew.map(c => (
          <div key={c.id} className="crew-card">
            {c.image && <img src={c.image} alt={c.name} loading="lazy" />}
            <div className="crew-info">
              <div className="crew-name">{c.name}</div>
              <div className="crew-meta">
                <span>{c.agency}</span>
                <span className={`status ${c.status === 'active' ? 'success' : 'failed'}`}>{c.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
