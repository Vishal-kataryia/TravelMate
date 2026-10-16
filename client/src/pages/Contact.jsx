import { useState } from 'react';
import api from '../services/api';
import { IMAGES } from '../utils/images.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setOk('');
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Name, email, subject and message are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setOk(res.data.message);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page">
      <div className="page-banner" style={{ minHeight: 180 }}>
        <img src={IMAGES.lakeCanoe} alt="Calm lake with canoe" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Contact Us</h1><p>We usually reply within a day.</p></div>
      </div>
      <div className="aside-grid">
        <div className="card">
          {error && <div className="alert">{error}</div>}
          {ok && <div className="alert ok">{ok}</div>}
          <form onSubmit={submit}>
            <div className="grid grid-2">
              <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" value={form.name} onChange={update} required /></div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" name="email" value={form.email} onChange={update} required /></div>
            </div>
            <div className="grid grid-2">
              <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" value={form.phone} onChange={update} /></div>
              <div className="field"><label htmlFor="subject">Subject</label><input id="subject" name="subject" value={form.subject} onChange={update} required /></div>
            </div>
            <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="5" value={form.message} onChange={update} required /></div>
            <button className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? <><span className="spinner" /> Sending...</> : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Demo contact information</h3>
          <p className="muted">support@travelmate.demo<br />+91 98765 43210<br />India</p>
        </div>
      </div>
    </div>
  );
}
