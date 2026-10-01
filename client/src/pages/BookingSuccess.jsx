import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { imageForPlace, IMAGES } from '../utils/images.js';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data.booking);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load booking.');
      }
    }
    load();
  }, [bookingId]);

  if (error) return <div className="container page"><div className="alert">{error}</div></div>;
  if (!booking) return <div className="container page"><p><span className="spinner dark" /> Loading booking...</p></div>;

  const t = booking.travelId || {};
  return (
    <div className="container page">
      <div className="page-banner">
        <img src={t.destination ? imageForPlace(t.destination) : IMAGES.beach} alt="Booking confirmed" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>🎉 Booking Confirmed!</h1><p>Your seat is reserved. Show your Booking ID while boarding.</p></div>
      </div>
      <div className="card" style={{ textAlign: 'center' }}>
        <img src={IMAGES.friendsBeach} alt="Happy travelers" loading="lazy" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 14, marginBottom: 16 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <h2 style={{ marginTop: 0 }}>Booking details</h2>
        <div style={{ textAlign: 'left', maxWidth: 520, margin: '0 auto' }}>
          <p><strong>Booking ID:</strong> {booking.bookingId}</p>
          <p><strong>Passenger Name:</strong> {booking.userId?.name}</p>
          <p><strong>Source:</strong> {t.source}</p>
          <p><strong>Destination:</strong> {t.destination}</p>
          <p><strong>Travel Date:</strong> {t.travelDate ? new Date(t.travelDate).toDateString() : '-'}</p>
          <p><strong>Seat Number:</strong> {booking.seatNumber}</p>
          <p><strong>Food Preference:</strong> {booking.foodPreference}</p>
          <p><strong>Seat Preference:</strong> {booking.seatPreference}</p>
          <p><strong>Matched Traveler:</strong> {booking.matchedTravelerName || '-'}</p>
          <p><strong>Ticket Price:</strong> ₹{booking.price}</p>
          <p><strong>Booking Status:</strong> <span className="badge badge-green">{booking.bookingStatus}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
          <Link to="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
