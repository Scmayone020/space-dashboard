import { useEffect, useState } from 'react';

const QUERIES = ['aurora borealis', 'northern lights', 'aurora australis', 'geomagnetic storm aurora'];

export default function AuroraPhotos() {
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from multiple queries and combine for variety
    Promise.all(
      QUERIES.map(q =>
        fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&year_start=2020&page_size=4`)
          .then(r => r.json())
          .then(d => d.collection?.items || [])
          .catch(() => [])
      )
    )
      .then(results => {
        const all = results.flat().filter(item => item.links?.[0]?.href);
        // Deduplicate by nasa_id
        const seen = new Set();
        const unique = all.filter(item => {
          const id = item.data?.[0]?.nasa_id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setPhotos(unique.slice(0, 12));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load aurora photos');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = e => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const downloadPhoto = async () => {
    try {
      const blob = await fetch(lightbox.src).then(r => r.blob());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lightbox.title?.replace(/[^a-z0-9]/gi, '_') || 'aurora'}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Download failed — try right-clicking the image.');
    }
  };

  return (
    <div className="card aurora-photos">
      <h2>Aurora Photos — NASA Archive</h2>
      <p className="date">Real aurora photographs from NASA Image Library (2020–present)</p>

      {loading && <p className="loading">Loading aurora photos...</p>}
      {error && <p className="error">{error}</p>}

      <div className="aurora-photo-grid">
        {photos.map((item, i) => {
          const data = item.data?.[0];
          const thumb = item.links?.[0]?.href;
          return (
            <div
              key={i}
              className="aurora-photo-item"
              onClick={() => setLightbox({ src: thumb, title: data?.title, nasaId: data?.nasa_id })}
              title="Click to enlarge"
            >
              <img src={thumb} alt={data?.title} loading="lazy" />
              <div className="aurora-photo-overlay">
                <p>{data?.title}</p>
                <span>{data?.date_created?.slice(0, 4)}</span>
              </div>
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
            <button className="wallpaper-btn" onClick={downloadPhoto}>
              🖼 Download as Wallpaper
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
