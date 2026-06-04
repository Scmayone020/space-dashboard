import { useEffect, useState } from 'react';

export default function Exoplanets() {
  const [planets, setPlanets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,pl_rade,pl_bmasse,discoverymethod+from+ps+where+default_flag=1+order+by+disc_year+desc&format=json&pagesize=8')
      .then(r => r.json())
      .then(data => setPlanets(data.slice(0, 8)))
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
