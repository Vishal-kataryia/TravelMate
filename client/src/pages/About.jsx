import { IMAGES } from '../utils/images.js';

export default function About() {
  return (
    <div className="container page">
      <div className="page-banner">
        <img src={IMAGES.coupleMap} alt="Travelers planning a trip together" loading="lazy" />
        <div className="page-banner-overlay" />
        <div className="page-banner-text"><h1>About TravelMate</h1><p>Comfortable, social journeys across India.</p></div>
      </div>
      <div className="card">
        <img src={IMAGES.backpack} alt="Backpacker overlooking mountains" loading="lazy" className="card-img-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <h2>Why TravelMate?</h2>
        <p>
          Traveling alone can feel uncomfortable — strangers, different food habits and
          seating preferences can spoil a long journey. TravelMate helps travelers find
          compatible companions heading to the same destination on the same date, so the
          journey feels comfortable and social.
        </p>
      </div>
      <div className="grid grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <img src={IMAGES.friendsBeach} alt="Friends traveling together on beach" loading="lazy" className="card-img-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h2>Our Mission</h2>
          <p>Make travel booking more comfortable and social for everyone.</p>
        </div>
        <div className="card">
          <img src={IMAGES.roadTrip} alt="Van on a road trip" loading="lazy" className="card-img-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h2>How It Works</h2>
          <div className="steps" style={{ gridTemplateColumns: '1fr' }}>
            <div className="step"><span>🔍</span>Search Journey ↓</div>
            <div className="step"><span>⚙️</span>Set Preferences ↓</div>
            <div className="step"><span>🤝</span>Find Compatible Travelers ↓</div>
            <div className="step"><span>💺</span>Select Seat ↓</div>
            <div className="step"><span>✅</span>Confirm Booking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
