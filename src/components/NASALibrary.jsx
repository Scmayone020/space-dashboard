import { useEffect, useState } from 'react';

export default function NASALibrary() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('galaxy');
  const [input, setInput] = useState('galaxy');
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [downloading, setDownloading] = useState(false);

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

  const downloadWallpaper = async () => {
    setDownloading(true);
    try {
      // Try to get the full-resolution image from NASA asset manifest
      let imageUrl = lightbox.src;
      if (lightbox.nasaId) {
        const manifest = await fetch(`https://images-api.nasa.gov/asset/${lightbox.nasaId}`)
          .then(r => r.json()).catch(() => null);
        const orig = manifest?.collection?.items?.find(i =>
          i.href.match(/~orig\.(jpg|png|jpeg)/i)
        ) || manifest?.collection?.items?.[0];
        if (orig) imageUrl = orig.href;
      }
      const blob = await fetch(imageUrl).then(r => r.blob());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lightbox.title?.replace(/[^a-z0-9]/gi, '_') || 'nasa_wallpaper'}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Download failed. Try right-clicking the image and saving it.');
    }
    setDownloading(false);
  };

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
            <div key={i} className="library-item" onClick={() => setLightbox({ src: thumb, title: data?.title, nasaId: data?.nasa_id })} title="Click to enlarge">
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
            <button className="wallpaper-btn" onClick={downloadWallpaper} disabled={downloading}>
              {downloading ? 'Downloading...' : '🖼 Download as Wallpaper'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
