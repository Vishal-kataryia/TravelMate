import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';
import { IMAGES } from '../utils/images.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please provide a valid email.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page" style={{ maxWidth: 900 }}>
      <div className="card auth-split">
        <img src={IMAGES.hiker} alt="Traveler in mountains" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <div className="auth-split-body">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <img src={logo} alt="TravelMate logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 style={{ marginTop: 0, textAlign: 'center' }}>Register</h1>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="name">Full Name</label><input id="name" name="name" value={form.name} onChange={update} required /></div>
          <div className="grid grid-2">
            <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" name="email" value={form.email} onChange={update} required /></div>
            <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" value={form.phone} onChange={update} required /></div>
          </div>
          <div className="grid grid-2">
            <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" name="password" value={form.password} onChange={update} required /></div>
            <div className="field"><label htmlFor="confirmPassword">Confirm Password</label><input id="confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} required /></div>
          </div>
          <div className="grid grid-2">
            <div className="field"><label htmlFor="foodPreference">Food Preference</label>
              <select id="foodPreference" name="foodPreference" value={form.foodPreference} onChange={update}>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
            <div className="field"><label htmlFor="seatPreference">Seat Preference</label>
              <select id="seatPreference" name="seatPreference" value={form.seatPreference} onChange={update}>
                <option value="Vegetarian Only">Vegetarian Only</option>
                <option value="Non-Vegetarian Allowed">Non-Vegetarian Allowed</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700 }}>Login</Link></p>
        </div>
      </div>
    </div>
  );
}
