import { Link } from 'react-router-dom';
import { IMAGES } from '../utils/images.js';

export default function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center' }}>
      <img src={IMAGES.desert} alt="Lost on the road" loading="lazy" style={{ width: '100%', maxWidth: 560, height: 280, objectFit: 'cover', borderRadius: 20, margin: '0 auto 18px', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <h1>404 — Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
