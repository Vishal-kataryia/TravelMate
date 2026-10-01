import { IMAGES, imageForIndex } from '../utils/images.js';

const WORK = [
  { title: 'Tourist Travel Booking', desc: 'Delhi to Goa beach trip with matched companions.', color: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
  { title: 'Group Journeys', desc: 'Friends and families traveling to Manali together.', color: 'linear-gradient(135deg,#6366f1,#0ea5e9)' },
  { title: 'Destination Matching', desc: 'Same destination, same date — always matched first.', color: 'linear-gradient(135deg,#f97316,#f59e0b)' },
  { title: 'Vegetarian Travel Matching', desc: 'Vegetarian-only travelers seated comfortably.', color: 'linear-gradient(135deg,#16a34a,#0d9488)' },
  { title: 'Travel Companion Discovery', desc: 'Meet verified fellow travelers going your way.', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }
];

export default function OurWork() {
  return (
    <div className="container page">
      <div className="page-banner">
        <img src={IMAGES.hiker} alt="Traveler exploring mountains" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>Our Work</h1><p>Demonstrations of what the TravelMate platform can do.</p></div>
      </div>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {WORK.map((w, i) => (
          <div key={w.title} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={imageForIndex(i + 1)} alt={w.title} loading="lazy" className="card-img" style={{ height: 180 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div style={{ padding: 18 }}>
              <h3 style={{ margin: '0 0 6px' }}>{w.title}</h3>
              <p className="muted" style={{ margin: 0 }}>{w.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
