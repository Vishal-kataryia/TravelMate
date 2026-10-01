import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api';
import { imageForPlace } from '../utils/images.js';

function buildSeats(totalSeats) {
  const perSide = Math.floor(totalSeats / 2);
  const left = [];
  const right = [];
  for (let i = 1; i <= perSide; i++) {
    left.push(`A${i}`);
    right.push(`B${i}`);
  }
  return { left, right, perSide };
}

export default function Booking() {
  const { travelId } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seat, setSeat] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const matched = useMemo(() => ({
    id: params.get('travelerId') || '',
    name: params.get('travelerName') || 'Not selected',
    food: params.get('travelerFood') || '-',
    seatPref: params.get('travelerSeat') || '-',
    percentage: params.get('matchPercentage') || '-',
    reasons: (params.get('reasons') || '').split('|').filter(Boolean)
  }), [params]);

  const prefs = {
    foodPreference: params.get('foodPreference') || user?.foodPreference || 'Vegetarian',
    seatPreference: params.get('seatPreference') || user?.seatPreference || 'Vegetarian Only'
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/travels/${travelId}`);
        setTravel(res.data.travel);
      } catch (err) {
        setError('Journey not found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [travelId]);

  async function confirm() {
    setError('');
    if (!seat) {
      setError('Please select a seat before confirming.');
      return;
    }
    setConfirming(true);
    try {
      const res = await api.post('/bookings', {
        travelId,
        seatNumber: seat,
        foodPreference: prefs.foodPreference,
        seatPreference: prefs.seatPreference,
        matchedTravelerId: matched.id || null,
        matchedTravelerName: matched.name
      });
      navigate(`/booking-success/${res.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) return <div className="container page"><p><span className="spinner dark" /> Loading journey...</p></div>;
  if (!travel) return <div className="container page"><div className="alert">Journey not found.</div></div>;

  const { left, right } = buildSeats(travel.totalSeats);
  const booked = new Set(travel.bookedSeats || []);
  const rows = Math.ceil(left.length / 2);

  return (
    <div className="container page">
      <div className="page-banner" style={{ minHeight: 190 }}>
        <img src={imageForPlace(travel?.destination)} alt={travel ? `${travel.source} to ${travel.destination}` : 'Journey'} loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Complete Your Booking</h1><p>{travel ? `${travel.source} → ${travel.destination}` : 'Select your seat'}</p></div>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="grid grid-2">
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Journey Details</h2>
            <p><strong>{travel.source} → {travel.destination}</strong><br />
              {new Date(travel.travelDate).toDateString()} · {travel.departureTime} · ₹{travel.price}</p>
            <h3>Passenger</h3>
            <p className="muted">{user?.name} · {user?.email} · {user?.phone}</p>
            <h3>Preferences</h3>
            <p>Food: {prefs.foodPreference} · Seat: {prefs.seatPreference}</p>
            <h3>Matched Traveler</h3>
            <p><strong>{matched.name}</strong> · {matched.food} · {matched.seatPref} · {matched.percentage}% match</p>
            {matched.reasons.length > 0 && (
              <ul className="reasons">{matched.reasons.map((r) => <li key={r}>✓ {r}</li>)}</ul>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0 }}>Booking Summary</h3>
            <p className="muted">
              Passenger: {user?.name}<br />
              {travel.source} → {travel.destination}<br />
              Date: {new Date(travel.travelDate).toDateString()}<br />
              Seat: {seat || 'Not selected'}<br />
              Food: {prefs.foodPreference} · Seat pref: {prefs.seatPreference}<br />
              Matched Traveler: {matched.name}<br />
              Ticket Price: ₹{travel.price}
            </p>
            <div className="alert info">Payment Method: Demo Payment · Payment Status: Successful.<br />This is a demo payment and no real money is charged.</div>
            <button className="btn btn-primary" disabled={confirming} onClick={confirm} style={{ width: '100%' }}>
              {confirming ? <><span className="spinner" /> Confirming your booking...</> : 'Confirm Booking'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Select Your Seat</h2>
          <p className="muted">DRIVER ↑ · Green border = available, Blue = selected, Grey strikethrough = booked.</p>
          <div className="legend" style={{ marginBottom: 12 }}>
            <span>⬜ Available</span><span>🟦 Selected ({seat || 'none'})</span><span>⬛ Booked</span>
          </div>
          <div style={{ textAlign: 'center', fontWeight: 800, marginBottom: 10 }}>DRIVER</div>
          <div className="seat-map">
            {Array.from({ length: rows }).map((_, r) => {
              const seats = [left[r * 2], left[r * 2 + 1], right[r * 2], right[r * 2 + 1]].filter(Boolean);
              return (
                <div key={r} className="seat-row">
                  {seats.slice(0, 2).map((s) => (
                    <button key={s} disabled={booked.has(s)} onClick={() => setSeat(s)}
                      className={`seat ${booked.has(s) ? 'booked' : seat === s ? 'selected' : 'available'}`}
                      aria-label={`Seat ${s} ${booked.has(s) ? 'booked' : 'available'}`}>{s}</button>
                  ))}
                  <span className="seat-gap" />
                  {seats.slice(2).map((s) => (
                    <button key={s} disabled={booked.has(s)} onClick={() => setSeat(s)}
                      className={`seat ${booked.has(s) ? 'booked' : seat === s ? 'selected' : 'available'}`}
                      aria-label={`Seat ${s} ${booked.has(s) ? 'booked' : 'available'}`}>{s}</button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
