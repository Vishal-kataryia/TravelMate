import { Ticket, Users, MapPin, UtensilsCrossed, Armchair, Compass, CalendarCheck } from 'lucide-react';
import { IMAGES, imageForIndex } from '../utils/images.js';

const SERVICES = [
  { icon: Ticket, title: 'Ticket Booking', desc: 'Simple and fast journey booking.' },
  { icon: Users, title: 'Smart Traveler Matching', desc: 'Match by destination, date, food and seat.' },
  { icon: MapPin, title: 'Destination Matching', desc: 'Same destination = 50 match points.' },
  { icon: UtensilsCrossed, title: 'Food Preference Matching', desc: 'Vegetarian and non-vegetarian compatibility.' },
  { icon: Armchair, title: 'Seat Preference Selection', desc: 'Vegetarian-only or non-veg allowed seats.' },
  { icon: Compass, title: 'Travel Companion Discovery', desc: 'Meet people going your way.' },
  { icon: CalendarCheck, title: 'Booking Management', desc: 'View, manage and cancel bookings.' }
];

export default function Services() {
  return (
    <div className="container page">
      <div className="page-banner">
        <img src={IMAGES.bus} alt="Bus traveling on the road" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Our Services</h1><p>Everything you need for a comfortable shared journey.</p></div>
      </div>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {SERVICES.map((s, i) => (
          <div key={s.title} className="card">
            <img src={imageForIndex(i)} alt={s.title} loading="lazy" className="card-img-top" style={{ height: 150 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <s.icon size={30} color="#2563eb" />
            <h3>{s.title}</h3>
            <p className="muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
