import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { imageForPlace, IMAGES } from '../utils/images.js';

export default function Search() {
  const [params] = useSearchParams();
  const destination = params.get('destination') || '';
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const res = await api.get('/travels/search', { params: { destination } });
        setTravels(res.data.travels);
      } catch {
        setTravels([]);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [destination]);

  return (
    <div className="container page">
      <div className="page-banner">
        <img src={destination ? imageForPlace(destination) : IMAGES.planeWing} alt={destination ? `Journeys to ${destination}` : 'Journeys'} loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Journeys {destination ? `to ${destination}` : ''}</h1><p>Browse available routes and book your seat.</p></div>
      </div>
      {loading && <p><span className="spinner dark" /> Loading...</p>}
      {!loading && travels.length === 0 && (
        <div className="card">
          <p>No journeys found. <Link to="/book">Search again</Link></p>
        </div>
      )}
      <div className="grid grid-3">
        {travels.map((t, i) => (
          <div key={t._id} className="card" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}>
            <img src={imageForPlace(t.destination || destination)} alt={`${t.source} to ${t.destination}`} loading="lazy" className="card-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div style={{ padding: '16px 20px 20px' }}>
            <h3>{t.source} → {t.destination}</h3>
            <p className="muted">{new Date(t.travelDate).toDateString()} · ₹{t.price} · {t.availableSeats} seats left</p>
            <Link to="/book" className="btn btn-ghost">Book this route</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
