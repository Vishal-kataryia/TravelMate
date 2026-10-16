import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api';
import { IMAGES } from '../utils/images.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone, foodPreference: user.foodPreference, seatPreference: user.seatPreference });
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      setUser(res.data.user);
      setMsg(res.data.message || 'Profile updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div className="container page"><p>Loading profile...</p></div>;

  return (
    <div className="container page">
      <div className="page-banner" style={{ minHeight: 170 }}>
        <img src={IMAGES.backpack} alt="Traveler profile" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>My Profile</h1><p>Keep your travel preferences up to date.</p></div>
      </div>
      <div className="aside-grid">
        <div className="card">
          {msg && <div className="alert ok">{msg}</div>}
          {error && <div className="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="grid grid-2">
              <div className="field"><label htmlFor="name">Name</label><input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="field"><label htmlFor="phone">Phone</label><input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            </div>
            <div className="grid grid-2">
              <div className="field"><label htmlFor="food">Food Preference</label>
                <select id="food" value={form.foodPreference} onChange={(e) => setForm({ ...form, foodPreference: e.target.value })}>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
              <div className="field"><label htmlFor="seatp">Seat Preference</label>
                <select id="seatp" value={form.seatPreference} onChange={(e) => setForm({ ...form, seatPreference: e.target.value })}>
                  <option value="Vegetarian Only">Vegetarian Only</option>
                  <option value="Non-Vegetarian Allowed">Non-Vegetarian Allowed</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? <><span className="spinner" /> Updating...</> : 'Update Profile'}
            </button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Account</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="muted" style={{ marginBottom: 0 }}>Your email address cannot be changed.</p>
        </div>
      </div>
    </div>
  );
}
