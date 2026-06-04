import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function Payloads() {
  const [payloads, setPayloads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/payloads`)
      .then(r => r.json())
      .then(data => setPayloads(data.slice(-8).reverse()))
      .catch(() => setError('Failed to load payload data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!payloads.length) return <p className="loading">Loading payload data...</p>;

  return (
    <div className="card payloads">
      <h2>SpaceX Payloads (Recent)</h2>
      <ul>
        {payloads.map(p => (
          <li key={p.id}>
            <div className="launch-name">{p.name}</div>
            <div className="launch-meta">
              <span>Type: {p.type}</span>
              {p.mass_kg && <span>Mass: {p.mass_kg.toLocaleString()} kg</span>}
              {p.orbit && <span>Orbit: {p.orbit}</span>}
              {p.customers?.length > 0 && <span>Customer: {p.customers.join(', ')}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
