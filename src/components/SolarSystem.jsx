import { useEffect, useState } from 'react';

const BODIES = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export default function SolarSystem() {
  const [bodies, setBodies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,1&data=englishName,meanRadius,moons,sideralOrbit,gravity,id')
      .then(r => r.json())
      .then(data => {
        const planets = (data.bodies || []).filter(b => BODIES.includes(b.englishName?.toLowerCase()));
        if (planets.length) {
          setBodies(planets);
        } else {
          // fallback: fetch individually
          return Promise.all(
            BODIES.map(b => fetch(`https://api.le-systeme-solaire.net/rest/bodies/${b}`).then(r => r.json()))
          ).then(setBodies);
        }
      })
      .catch(() => setError('Failed to load solar system data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!bodies.length) return <p className="loading">Loading solar system data...</p>;

  return (
    <div className="card solar-system">
      <h2>Solar System Bodies (JPL/SSD)</h2>
      <ul>
        {bodies.map(b => (
          <li key={b.id}>
            <div className="body-name">{b.englishName}</div>
            <div className="body-meta">
              {b.meanRadius && <span>Radius: {b.meanRadius.toLocaleString()} km</span>}
              {b.moons && <span>Moons: {b.moons.length}</span>}
              {b.sideralOrbit && <span>Orbit: {b.sideralOrbit.toFixed(1)} days</span>}
              {b.gravity && <span>Gravity: {b.gravity} m/s²</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
