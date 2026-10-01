import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IMAGES, imageForPlace } from '../utils/images.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    if (!window.confirm('Cancel this booking? The seat will become available again.')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    }
  }

  if (loading) return <div className="container page"><p><span className="spinner dark" /> Loading your bookings...</p></div>;

  return (
    <div className="container page">
      <div className="page-banner" style={{ minHeight: 190 }}>
        <img src={IMAGES.planeWing} alt="My bookings" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>My Bookings</h1><p>All your journeys in one place.</p></div>
      </div>
      {error && <div className="alert">{error}</div>}
      {bookings.length === 0 && !error && (
        <div className="card"><p>No bookings yet. <Link to="/book">Book your first journey</Link></p></div>
      )}
      <div className="grid grid-2">
        {bookings.map((b) => (
          <div key={b._id} className="card" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}>
            <img src={imageForPlace(b.travelId?.destination)} alt={`${b.travelId?.source} to ${b.travelId?.destination}`} loading="lazy" className="card-img" style={{ height: 150 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{b.bookingId}</strong>
              <span className={`badge ${b.bookingStatus === 'Confirmed' ? 'badge-green' : 'badge-orange'}`}>{b.bookingStatus}</span>
            </div>
            <p>
              <strong>{b.travelId?.source} → {b.travelId?.destination}</strong><br />
              <span className="muted">{b.travelId?.travelDate ? new Date(b.travelId.travelDate).toDateString() : '-'} · Seat {b.seatNumber} · ₹{b.price}</span><br />
              Matched traveler: {b.matchedTravelerName || '-'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to={`/booking-success/${b._id}`} className="btn btn-ghost">View</Link>
              {b.bookingStatus === 'Confirmed' && (
                <button className="btn btn-orange" onClick={() => cancel(b._id)}>Cancel</button>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
