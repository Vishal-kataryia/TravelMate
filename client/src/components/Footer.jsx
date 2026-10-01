import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={logo} alt="TravelMate logo" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> TravelMate
          </h4>
          <p>Travel Together, Travel Better</p>
          <p style={{ fontSize: 13 }}>Find compatible companions, choose your seat, and book with confidence.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <Facebook size={20} aria-label="Facebook" />
            <Instagram size={20} aria-label="Instagram" />
            <Twitter size={20} aria-label="Twitter" />
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/book">Book Ticket</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Demo Contact</h4>
          <p style={{ fontSize: 13 }}>support@travelmate.demo<br />+91 98765 43210<br />India (demo information)</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 TravelMate. Student Demo Project.</div>
    </footer>
  );
}
