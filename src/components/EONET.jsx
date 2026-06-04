import { useEffect, useState } from 'react';

const CATEGORY_ICONS = {
  'Wildfires': '🔥',
  'Severe Storms': '🌪️',
  'Volcanoes': '🌋',
  'Sea and Lake Ice': '🧊',
  'Earthquakes': '⚠️',
  'Floods': '🌊',
  'Drought': '☀️',
  'Dust and Haze': '💨',
};

export default function EONET() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=8&status=open')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setError('Failed to load natural events'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!events.length) return <p className="loading">Loading natural events...</p>;

  return (
    <div className="card eonet">
      <h2>Active Natural Events (EONET)</h2>
      <ul>
        {events.map(e => {
          const icon = CATEGORY_ICONS[e.categories[0]?.title] || '🌍';
          return (
            <li key={e.id}>
              <span className="eonet-icon">{icon}</span>
              <div>
                <div className="event-type">{e.title}</div>
                <div className="event-date">{e.categories[0]?.title} — {new Date(e.geometry[0]?.date).toLocaleDateString()}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
