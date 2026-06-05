import { useEffect, useState } from 'react';

export default function Aurorasaurus() {
  const [sightings, setSightings] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aurorasaurus verified sightings
    fetch('https://api.aurorasaurus.org/v1/sightings?hours=24')
      .then(r => r.json())
      .then(data => setSightings((data.sightings || []).slice(0, 6)))
      .catch(() => {
        // API may be rate-limited or require auth — show fallback
        setError('Live sightings unavailable — visit aurorasaurus.org for real-time reports');
      });
  }, []);

  return (
    <div className="card aurorasaurus">
      <h2>Aurorasaurus — Crowdsourced Sightings</h2>
      <p className="date">Community-reported aurora sightings in the last 24 hours</p>

      {error ? (
        <div className="aurora-fallback">
          <p className="event-body">{error}</p>
          <a href="https://www.aurorasaurus.org" target="_blank" rel="noreferrer" className="aurora-link">
            View live sightings on Aurorasaurus →
          </a>
        </div>
      ) : !sightings.length ? (
        <p className="loading">Loading sightings...</p>
      ) : (
        <ul>
          {sightings.map((s, i) => (
            <li key={i}>
              <div className="launch-name">{s.city || s.location || 'Unknown location'}</div>
              <div className="launch-meta">
                <span>{s.country}</span>
                <span>{new Date(s.created_at).toLocaleString()}</span>
                {s.rating && <span>Rating: {'★'.repeat(s.rating)}</span>}
              </div>
              {s.note && <p className="launch-details">{s.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
