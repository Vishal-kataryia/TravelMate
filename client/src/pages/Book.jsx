import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { IMAGES, imageForPlace, JAIPUR_PEXELS } from '../utils/images.js';

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    source: 'Delhi',
    destination: params.get('destination') || 'Jaipur',
    travelDate: '2026-10-15',
    passengers: 1,
    foodPreference: 'Vegetarian',
    seatPreference: 'Vegetarian Only'
  });
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function loadJourneys() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/travels');
      setJourneys(res.data.travels);
    } catch (err) {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadJourneys(); }, []);

  function goToMatching(e) {
    e.preventDefault();
    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError('Source and destination cannot be the same.');
      return;
    }
    navigate(`/matching?${new URLSearchParams(form).toString()}`);
  }

  return (
    <div className="container page">
      <div className="page-banner">
        <img src={IMAGES.roadTrip} alt="Book your journey" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Book Ticket</h1><p>Search journeys and find compatible companions.</p></div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Search Journey</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={goToMatching} className="search-form">
          <div className="field">
            <label htmlFor="bsource">Starting Location</label>
            <input id="bsource" name="source" value={form.source} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="bdest">Destination</label>
            <input id="bdest" name="destination" value={form.destination} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="bdate">Travel Date</label>
            <input id="bdate" type="date" name="travelDate" value={form.travelDate} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="bpass">Number of Passengers</label>
            <input id="bpass" type="number" min="1" name="passengers" value={form.passengers} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="bfood">Food Preference</label>
            <select id="bfood" name="foodPreference" value={form.foodPreference} onChange={update}>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="bseat">Seat Preference</label>
            <select id="bseat" name="seatPreference" value={form.seatPreference} onChange={update}>
              <option value="Vegetarian Only">Vegetarian Only</option>
              <option value="Non-Vegetarian Allowed">Non-Vegetarian Allowed</option>
            </select>
          </div>
        </form>
        <button className="btn btn-primary" onClick={goToMatching}>Find My Travel Match</button>
      </div>

      <h2 style={{ marginTop: 28 }}>Available Journeys</h2>
      {loading && <p><span className="spinner dark" /> Loading journeys...</p>}
      {/* Featured Delhi → Jaipur journey — always available, with Hawa Mahal image. */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <img src={JAIPUR_PEXELS.hawaMahal} alt="Delhi to Jaipur journey — Hawa Mahal" loading="lazy" className="card-img" style={{ height: 220 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="badge badge-green" style={{ position: 'absolute', top: 12, left: 12 }}>Available</span>
        </div>
        <div style={{ padding: '16px 20px 20px' }} className="journey-feature-row">
          <div>
            <h3 style={{ margin: '0 0 4px' }}>Delhi → Jaipur</h3>
            <p className="muted" style={{ margin: 0 }}>From: Delhi · To: Jaipur · Departure: Delhi · Destination: Jaipur · Route: Delhi → Jaipur · Status: Available</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/matching?source=Delhi&destination=Jaipur&travelDate=${form.travelDate}&passengers=${form.passengers}&foodPreference=${form.foodPreference}&seatPreference=${form.seatPreference}`)}>
            Find matches
          </button>
        </div>
      </div>
      <div className="grid grid-3">
        {journeys.map((j) => (
          <div key={j._id} className="card" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={imageForPlace(j.destination)} alt={`${j.source} to ${j.destination}`} loading="lazy" className="card-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="badge badge-blue" style={{ position: 'absolute', top: 12, left: 12 }}>{j.availableSeats} seats left</span>
            </div>
            <div className="journey-card-body">
            <h3>{j.source} → {j.destination}</h3>
            <p className="muted">{new Date(j.travelDate).toDateString()} · {j.departureTime} · ₹{j.price}</p>
            <button className="btn btn-ghost" onClick={() => navigate(`/matching?source=${j.source}&destination=${j.destination}&travelDate=${new Date(j.travelDate).toISOString().slice(0, 10)}&passengers=1&foodPreference=${form.foodPreference}&seatPreference=${form.seatPreference}`)}>
              Find matches
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
