import { useEffect, useState } from 'react';

export default function NASALibrary() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('galaxy');
  const [input, setInput] = useState('galaxy');
  const [error, setError] = useState(null);

  const search = (q) => {
    setError(null);
    setItems([]);
    fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=6`)
      .then(r => r.json())
      .then(data => setItems(data.collection?.items?.slice(0, 6) || []))
      .catch(() => setError('Failed to load NASA media'));
  };

  useEffect(() => { search(query); }, [query]);

  return (
    <div className="card nasa-library">
      <h2>NASA Image & Video Library</h2>
      <div className="search-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setQuery(input)}
          placeholder="Search NASA media..."
        />
        <button onClick={() => setQuery(input)}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="library-grid">
        {items.map((item, i) => {
          const data = item.data?.[0];
          const thumb = item.links?.[0]?.href;
          return (
            <div key={i} className="library-item">
              {thumb && <img src={thumb} alt={data?.title} loading="lazy" />}
              <p>{data?.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
