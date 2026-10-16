import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';
import { IMAGES } from '../utils/images.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'demo@travelmate.com', password: 'Demo@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const notice = location.state?.message;

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page" style={{ maxWidth: 1040 }}>
      <div className="card auth-split">
        <img src={IMAGES.coupleMap} alt="Travelers planning journey" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <div className="auth-split-body">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <img src={logo} alt="TravelMate logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 style={{ marginTop: 0, textAlign: 'center' }}>Login</h1>
        {notice && <div className="alert info">{notice}</div>}
        {error && <div className="alert">{error}</div>}
        <div className="alert info">Demo account — Email: demo@travelmate.com · Password: Demo@123</div>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <><span className="spinner" /> Logging in...</> : 'Login'}
          </button>
        </form>
        <p>New here? <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
