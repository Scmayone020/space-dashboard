import { useEffect, useState } from 'react';
import { NASA_BASE, NASA_API_KEY } from '../config';

export default function DONKI() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fetch(`${NASA_BASE}/DONKI/notifications?startDate=${start}&endDate=${end}&type=all&api_key=${NASA_API_KEY}`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setError('Failed to load space weather data'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!events.length) return <p className="loading">Loading space weather events...</p>;

  return (
    <div className="card donki">
      <h2>Space Weather (DONKI) — Last 30 Days</h2>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            <div className="event-type">{e.messageType}</div>
            <div className="event-date">{new Date(e.messageIssueTime).toLocaleDateString()}</div>
            <p className="event-body">{e.messageBody?.slice(0, 200)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
