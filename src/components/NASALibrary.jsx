import { useEffect, useState } from 'react';

export default function NASALibrary() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('galaxy');
  const [input, setInput] = useState('galaxy');
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const search = (q) => {
    setError(null);
    setItems([]);
    fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=6`)
      .then(r => r.json())
      .then(data => setItems(data.collection?.items?.slice(0, 6) || []))
      .catch(() => setError('Failed to load NASA media'));
  };

  useEffect(() => { search(query); }, [query]);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
            <div key={i} className="library-item" onClick={() => setLightbox({ src: thumb, title: data?.title })} title="Click to enlarge">
              {thumb && <img src={thumb} alt={data?.title} loading="lazy" />}
              <p>{data?.title}</p>
            </div>
          );
        })}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.src} alt={lightbox.title} />
            <p>{lightbox.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
