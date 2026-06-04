import { useEffect, useState } from 'react';
import { NASA_BASE, NASA_API_KEY } from '../config';

export default function Techport() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${NASA_BASE}/techport/api/projects?api_key=${NASA_API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const ids = data.projects?.slice(0, 5) || [];
        return Promise.all(ids.map(id =>
          fetch(`${NASA_BASE}/techport/api/projects/${id}?api_key=${NASA_API_KEY}`).then(r => r.json())
        ));
      })
      .then(results => setProjects(results.map(r => r.project).filter(Boolean)))
      .catch(() => setError('Failed to load Techport projects'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!projects.length) return <p className="loading">Loading NASA tech projects...</p>;

  return (
    <div className="card techport">
      <h2>NASA Technology Projects (Techport)</h2>
      <ul>
        {projects.map(p => (
          <li key={p.projectId}>
            <div className="tech-name">{p.title}</div>
            <div className="tech-meta">
              <span>{p.statusDescription}</span>
              {p.startTrl && <span>TRL: {p.startTrl} → {p.currentTrl}</span>}
            </div>
            {p.description && <p>{p.description.slice(0, 150)}...</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
