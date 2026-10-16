import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Armchair, Ticket, HeartHandshake } from 'lucide-react';
import { IMAGES, imageForPlace } from '../utils/images.js';
import jalMahalImg from '../assets/jal-mahal.jpg';

const DESTINATIONS = [
  { name: 'Goa', desc: 'Beaches, nightlife and sunshine.', color: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
  { name: 'Manali', desc: 'Mountains, snow and adventure.', color: 'linear-gradient(135deg,#6366f1,#0ea5e9)' },
  // Authentic Jal Mahal (Water Palace) photograph stored locally.
  { name: 'Jaipur', desc: 'Palaces, forts and the Pink City.', img: jalMahalImg },
  { name: 'Kerala', desc: 'Backwaters and greenery.', color: 'linear-gradient(135deg,#16a34a,#0d9488)' },
  { name: 'Mumbai', desc: 'City lights and Bollywood.', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { name: 'Delhi', desc: 'History meets modern India.', color: 'linear-gradient(135deg,#ef4444,#f97316)' }
];

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ source: 'Delhi', destination: 'Jaipur', travelDate: '2026-10-15', passengers: 1, foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only' });
  const [error, setError] = useState('');

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.source || !form.destination || !form.travelDate || !form.passengers || !form.foodPreference || !form.seatPreference) {
      setError('All fields are required.');
      return;
    }
    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError('Source and destination cannot be the same.');
      return;
    }
    if (Number(form.passengers) < 1) {
      setError('Passenger count must be at least 1.');
      return;
    }
    const params = new URLSearchParams(form);
    navigate(`/matching?${params.toString()}`);
  }

  return (
    <div className="container page" style={{ paddingTop: 24 }}>
      <section className="hero" style={{ backgroundImage: `linear-gradient(120deg, rgba(29,78,216,.88) 0%, rgba(13,148,136,.75) 55%, rgba(22,163,74,.75) 100%), url(${IMAGES.hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1>Travel Together, Travel Better</h1>
        <p>Find compatible travel companions, choose your preferred seat, and book your journey with confidence.</p>
        <div className="hero-actions">
          <Link to="/book" className="btn btn-orange">Book Your Journey</Link>
          <a href="#destinations" className="btn btn-ghost">Explore Destinations</a>
        </div>
      </section>

      <section className="card search-card">
        <h2 style={{ marginTop: 0, display: 'flex', gap: 8, alignItems: 'center' }}><Search size={22} /> Find My Travel Match</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={submit} className="search-form">
          <div className="field">
            <label htmlFor="source">Starting Location</label>
            <input id="source" name="source" value={form.source} onChange={update} placeholder="Delhi" required />
          </div>
          <div className="field">
            <label htmlFor="destination">Destination</label>
            <input id="destination" name="destination" value={form.destination} onChange={update} placeholder="Goa" required />
          </div>
          <div className="field">
            <label htmlFor="travelDate">Travel Date</label>
            <input id="travelDate" type="date" name="travelDate" value={form.travelDate} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="passengers">Number of Passengers</label>
            <input id="passengers" type="number" min="1" name="passengers" value={form.passengers} onChange={update} required />
          </div>
          <div className="field">
            <label htmlFor="foodPreference">Food Preference</label>
            <select id="foodPreference" name="foodPreference" value={form.foodPreference} onChange={update} required>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="seatPreference">Seat Preference</label>
            <select id="seatPreference" name="seatPreference" value={form.seatPreference} onChange={update} required>
              <option value="Vegetarian Only">Vegetarian Only</option>
              <option value="Non-Vegetarian Allowed">Non-Vegetarian Allowed</option>
            </select>
          </div>
        </form>
        <button className="btn btn-primary" onClick={submit} style={{ marginTop: 6 }}>Find My Travel Match</button>
      </section>

      <section id="destinations" style={{ marginTop: 44 }}>
        <h2>Popular Destinations</h2>
        <p className="muted">Pick a place and start your journey.</p>
        <div className="dest-grid">
          {DESTINATIONS.map((d) => (
            <div key={d.name} className="card dest-card">
              <div className="dest-img-wrap">
                <img className="dest-img-photo" src={d.img || imageForPlace(d.name)} alt={`${d.name} travel destination`} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="dest-img-label">{d.name}</span>
              </div>
              <div className="dest-body">
                <p>{d.desc}</p>
                <button className="btn btn-ghost" onClick={() => navigate(`/book?destination=${d.name}`)}>Explore</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2>Travel moments</h2>
        <p className="muted">A glimpse of journeys made with TravelMate.</p>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {[IMAGES.roadTrip, IMAGES.beach, IMAGES.mountains].map((src, i) => (
            <img key={i} src={src} alt={`Travel moment ${i + 1}`} loading="lazy" className="moment-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2>Why TravelMate</h2>
        <div className="grid grid-4" style={{ marginTop: 12 }}>
          <div className="card"><Users size={28} color="#2563eb" /><h3>Smart Matching</h3><p className="muted">Find compatible travelers.</p></div>
          <div className="card"><Armchair size={28} color="#0d9488" /><h3>Comfortable Travel</h3><p className="muted">Choose your seating preference.</p></div>
          <div className="card"><Ticket size={28} color="#f97316" /><h3>Easy Booking</h3><p className="muted">Book your journey easily.</p></div>
          <div className="card"><HeartHandshake size={28} color="#16a34a" /><h3>Travel Together</h3><p className="muted">Discover compatible travel companions.</p></div>
        </div>
      </section>
    </div>
  );
}
