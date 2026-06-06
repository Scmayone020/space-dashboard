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

const SOURCE_LABELS = {
  'USGS_EHP':   'USGS Earthquakes',
  'USGS_CMT':   'USGS',
  'InciWeb':    'InciWeb Wildfire',
  'PDC':        'Pacific Disaster Center',
  'NOAA_NHC':   'NOAA Hurricane Center',
  'GDACS':      'GDACS Disaster Alert',
  'EONET':      'NASA EONET',
  'MBFIRE':     'Montana Fires',
  'CALFIRE':    'CAL FIRE',
  'NASA_FIRMS': 'NASA Fire Info',
};

function getSourceLabel(id) {
  for (const key of Object.keys(SOURCE_LABELS)) {
    if (id?.includes(key)) return SOURCE_LABELS[key];
  }
  return 'Source';
}

function getNewsSearchUrl(title) {
  const query = encodeURIComponent(title);
  return `https://news.google.com/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
}

function getWikiUrl(title) {
  // Strip coordinates/codes from title for better wiki search
  const clean = title.replace(/\(.*?\)/g, '').trim();
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(clean)}`;
}

export default function EONET() {
  const [events, setEvents] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=10&status=open')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setError('Failed to load natural events'));
  }, []);

  const toggleEvent = (eventId, title) => {
    if (expanded === eventId) {
      setExpanded(null);
      return;
    }
    setExpanded(eventId);

    // Fetch Wikipedia summary if not already loaded
    if (!articles[eventId]) {
      const clean = title.replace(/\(.*?\)/g, '').replace(/\d{4}/g, '').trim();
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`)
        .then(r => r.json())
        .then(data => {
          if (data.extract) {
            setArticles(prev => ({ ...prev, [eventId]: data }));
          }
        })
        .catch(() => {});
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!events.length) return <p className="loading">Loading natural events...</p>;

  return (
    <div className="card eonet">
      <h2>Active Natural Events (EONET)</h2>
      <ul>
        {events.map(e => {
          const icon = CATEGORY_ICONS[e.categories[0]?.title] || '🌍';
          const isOpen = expanded === e.id;
          const wiki = articles[e.id];
          const date = new Date(e.geometry?.[0]?.date).toLocaleDateString();
          const coords = e.geometry?.[0]?.coordinates;

          return (
            <li key={e.id} className={`eonet-event ${isOpen ? 'eonet-open' : ''}`}>
              <div className="eonet-header" onClick={() => toggleEvent(e.id, e.title)}>
                <span className="eonet-icon">{icon}</span>
                <div className="eonet-summary">
                  <div className="event-type">{e.title}</div>
                  <div className="event-date">{e.categories[0]?.title} — {date}</div>
                </div>
                <span className="eonet-chevron">{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div className="eonet-detail">
                  {coords && (
                    <div className="eonet-coords">
                      📍 {coords[1]?.toFixed(2)}°, {coords[0]?.toFixed(2)}°
                    </div>
                  )}

                  {/* Wikipedia summary */}
                  {wiki && (
                    <div className="eonet-wiki">
                      {wiki.thumbnail?.source && (
                        <img src={wiki.thumbnail.source} alt={wiki.title} className="wiki-thumb" />
                      )}
                      <p className="wiki-extract">{wiki.extract?.slice(0, 300)}...</p>
                    </div>
                  )}

                  {/* Article / source links */}
                  <div className="eonet-links">
                    <a
                      href={getNewsSearchUrl(e.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="eonet-link news-link"
                    >
                      📰 Google News
                    </a>
                    {wiki && (
                      <a
                        href={wiki.content_urls?.desktop?.page}
                        target="_blank"
                        rel="noreferrer"
                        className="eonet-link wiki-link"
                      >
                        📖 Wikipedia
                      </a>
                    )}
                    {!wiki && (
                      <a
                        href={getWikiUrl(e.title)}
                        target="_blank"
                        rel="noreferrer"
                        className="eonet-link wiki-link"
                      >
                        📖 Wikipedia Search
                      </a>
                    )}
                    {e.sources?.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="eonet-link source-link"
                      >
                        🔗 {getSourceLabel(s.id)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
