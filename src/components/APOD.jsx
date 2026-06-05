import { useEffect, useState } from 'react';
import { NASA_BASE, NASA_API_KEY } from '../config';

export default function APOD() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${NASA_BASE}/planetary/apod?api_key=${NASA_API_KEY}`)
      .then(r => r.json())
      .then(data => {
        if (data.error || data.code) throw new Error(data.msg || 'API error');
        setData(data);
      })
      .catch(() => setError('Failed to load APOD — NASA API key may need to be refreshed'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Loading Astronomy Picture of the Day...</p>;

  return (
    <div className="card apod">
      <h2>Astronomy Picture of the Day</h2>
      <p className="date">{data.date}</p>
      {data.media_type === 'image' ? (
        <img src={data.url} alt={data.title} />
      ) : (
        <iframe src={data.url} title={data.title} allowFullScreen />
      )}
      <h3>{data.title}</h3>
      <p className="explanation">{data.explanation}</p>
    </div>
  );
}
