import { useEffect, useState } from 'react';

export default function Exoplanets() {
  const [planets, setPlanets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+8+pl_name,hostname,disc_year,pl_rade,discoverymethod+from+ps+where+default_flag%3D1+order+by+disc_year+desc&format=json')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('No data');
        setPlanets(data);
      })
      .catch(() => setError('Failed to load exoplanet data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!planets.length) return <p className="loading">Loading exoplanet data...</p>;

  return (
    <div className="card exoplanets">
      <h2>Recently Discovered Exoplanets</h2>
      <ul>
        {planets.map((p, i) => (
          <li key={i}>
            <div className="planet-name">{p.pl_name}</div>
            <div className="planet-meta">
              <span>Host: {p.hostname}</span>
              <span>Discovered: {p.disc_year}</span>
              <span>Method: {p.discoverymethod}</span>
              {p.pl_rade && <span>Radius: {p.pl_rade.toFixed(2)} R⊕</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
