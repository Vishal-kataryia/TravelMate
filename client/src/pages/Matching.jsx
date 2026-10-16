import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../services/api';
import { IMAGES, imageForIndex, imageForPlace } from '../utils/images.js';

function fmtDate(s) {
  try {
    return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return s;
  }
}

export default function Matching() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prefs = {
    source: params.get('source') || '',
    destination: params.get('destination') || '',
    travelDate: params.get('travelDate') || '',
    passengers: params.get('passengers') || '1',
    foodPreference: params.get('foodPreference') || '',
    seatPreference: params.get('seatPreference') || ''
  };
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/matching', { params: prefs });
        setMatches(res.data.matches || []);
        if ((res.data.matches || []).length === 0) {
          const j = await api.get('/travels/search', { params: { destination: prefs.destination } });
          setJourneys(j.data.travels || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(m) {
    const q = new URLSearchParams({
      ...prefs,
      travelId: m.travel._id,
      travelerId: m.traveler._id,
      travelerName: m.traveler.name,
      travelerFood: m.traveler.foodPreference,
      travelerSeat: m.traveler.seatPreference,
      matchPercentage: String(m.matchPercentage),
      reasons: m.reasons.join('|')
    });
    navigate(`/booking/${m.travel._id}?${q.toString()}`);
  }

  return (
    <div className="container page">
      <div className="page-banner">
        <img src={prefs.destination ? imageForPlace(prefs.destination) : IMAGES.friendsBeach} alt="Compatible travelers" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Search Results</h1><p>{prefs.source} → {prefs.destination} · {prefs.travelDate}</p></div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your Matching Preferences</h2>
        <p><strong>Source:</strong> {prefs.source} · <strong>Destination:</strong> {prefs.destination} · <strong>Travel Date:</strong> {fmtDate(prefs.travelDate)} · <strong>Food:</strong> {prefs.foodPreference} · <strong>Seat Preference:</strong> {prefs.seatPreference}</p>
        <Link to="/book" className="btn btn-ghost">Change Preferences</Link>
      </div>

      <h2 style={{ marginTop: 24 }}>Compatible Travelers Found</h2>
      {loading && <p><span className="spinner dark" /> Finding compatible travelers...</p>}
      {error && <div className="alert">{error}</div>}

      {!loading && !error && matches.length === 0 && (
        <div className="card">
          <h3>We couldn't find a compatible traveler right now.</h3>
          <p className="muted">Try different preferences or browse available journeys below.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/book" className="btn btn-primary">Search Again</Link>
            <Link to="/book" className="btn btn-ghost">Change Preferences</Link>
            <a href="#journeys" className="btn btn-ghost">View Available Journeys</a>
          </div>
          <div id="journeys" className="grid grid-3" style={{ marginTop: 18 }}>
            {journeys.map((j) => (
              <div key={j._id} className="card">
                <h4>{j.source} → {j.destination}</h4>
                <p className="muted">{fmtDate(j.travelDate)} · ₹{j.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-3" style={{ marginTop: 12 }}>
        {matches.map((m, i) => (
          <div key={i} className="card" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}>
            <img src={imageForIndex(i + 3)} alt={`${m.traveler.name} traveler`} loading="lazy" className="card-img" style={{ height: 150 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className="journey-card-body">
            <h3 style={{ margin: '0 0 4px' }}>{m.traveler.name}</h3>
            <p className="muted" style={{ margin: 0 }}>{m.travel.source} → {m.travel.destination}<br />{fmtDate(m.travel.travelDate)} · {m.travel.departureTime}</p>
            <p style={{ margin: '8px 0' }}>{m.traveler.foodPreference} · {m.traveler.seatPreference}</p>
            <div className="match-meta">
              <span>{m.matchPercentage}% Match</span>
              <span className="muted">₹{m.travel.price}</span>
            </div>
            <div className="match-bar" style={{ marginTop: 6 }}><div className="match-fill" style={{ width: `${m.matchPercentage}%` }} /></div>
            <ul className="reasons">
              {m.reasons.map((r) => (
                <li key={r}><Check size={15} /> ✓ {r}</li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={() => select(m)} style={{ width: '100%' }}>Select Traveler</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
