import { useEffect, useState } from 'react';
import { NASA_BASE, NASA_API_KEY } from '../config';

export default function EPIC() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${NASA_BASE}/EPIC/api/natural?api_key=${NASA_API_KEY}`)
      .then(r => r.json())
      .then(data => setImages(data.slice(0, 4)))
      .catch(() => setError('Failed to load EPIC images'));
  }, []);

  const getImageUrl = (img) => {
    const [year, month, day] = img.date.split(' ')[0].split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${img.image}.png`;
  };

  if (error) return <p className="error">{error}</p>;
  if (!images.length) return <p className="loading">Loading Earth imagery...</p>;

  return (
    <div className="card epic">
      <h2>Earth from DSCOVR (EPIC Camera)</h2>
      <div className="epic-grid">
        {images.map(img => (
          <div key={img.identifier} className="epic-item">
            <img src={getImageUrl(img)} alt={img.caption} loading="lazy" />
            <p>{new Date(img.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
