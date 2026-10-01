import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/our-work', label: 'Our Work' },
    { to: '/book', label: 'Book Ticket' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="TravelMate logo" className="brand-logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          TravelMate
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} style={({ isActive }) => ({ color: isActive ? '#2563eb' : undefined })}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-cta desktop-only">
          {user ? (
            <>
              <Link to="/my-bookings" className="btn btn-ghost" style={{ padding: '8px 16px' }}>My Bookings</Link>
              <Link to="/profile" className="btn btn-ghost" style={{ padding: '8px 16px' }}>Profile</Link>
              <button className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 16px' }}>Login / Register</Link>
              <Link to="/book" className="btn btn-primary" style={{ padding: '8px 18px' }}>Book Now</Link>
            </>
          )}
        </div>
        <button className="hamburger" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        {user ? (
          <>
            <Link to="/my-bookings" onClick={() => setOpen(false)}>My Bookings</Link>
            <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>Login / Register</Link>
            <Link to="/book" className="btn btn-primary" onClick={() => setOpen(false)}>Book Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}
