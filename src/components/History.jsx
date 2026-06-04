import { useEffect, useState } from 'react';
import { SPACEX_BASE } from '../config';

export default function History() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SPACEX_BASE}/history`)
      .then(r => r.json())
      .then(data => setEvents([...data].reverse().slice(0, 8)))
      .catch(() => setError('Failed to load SpaceX history'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!events.length) return <p className="loading">Loading SpaceX history...</p>;

  return (
    <div className="card history">
      <h2>SpaceX Historical Milestones</h2>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            <div className="launch-name">{e.title}</div>
            <div className="event-date">{new Date(e.event_date_utc).toLocaleDateString()}</div>
            <p className="launch-details">{e.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
