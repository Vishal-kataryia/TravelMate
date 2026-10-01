const Travel = require('../models/Travel');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sameDay, withAvailability } = require('./travelController');

/**
 * Matching rules (backend, deterministic - no random scores):
 *  Rule 1: destination MUST match (case-insensitive).
 *  Rule 2: travel date MUST be the same calendar day.
 *  Rule 3+4: food/seat compatibility:
 *    - same food => compatible
 *    - veg user + non-veg traveler => compatible ONLY if user allows non-veg
 *      (seatPreference === 'Non-Vegetarian Allowed') AND traveler does not force veg-only
 *      against a non-veg user. In practice: blocked if either veg person demands 'Vegetarian Only'
 *      while the other person is Non-Vegetarian.
 *
 * Score: destination 50 + date 20 + food 15 + seat 15 = 100.
 */

function foodSeatCompatible(userFood, userSeat, travelerFood, travelerSeat) {
  if (userFood === travelerFood) return { compatible: true, foodScore: 15, seatScore: travelerSeat === userSeat ? 15 : 10 };
  // Different food: blocked if a vegetarian demands Vegetarian Only
  if (userFood === 'Vegetarian' && userSeat === 'Vegetarian Only' && travelerFood === 'Non-Vegetarian') {
    return { compatible: false, foodScore: 0, seatScore: 0 };
  }
  if (travelerFood === 'Vegetarian' && travelerSeat === 'Vegetarian Only' && userFood === 'Non-Vegetarian') {
    return { compatible: false, foodScore: 0, seatScore: 0 };
  }
  // Allowed cross-food case (e.g. veg + "Non-Vegetarian Allowed" with non-veg)
  return { compatible: true, foodScore: 10, seatScore: travelerSeat === userSeat ? 15 : 10 };
}

function buildReasons(travel, traveler, score) {
  const reasons = ['Same destination', 'Same travel date'];
  if (traveler.foodPreference) {
    reasons.push(score.foodScore === 15 ? 'Compatible food preference' : 'Food preference acceptable');
  }
  reasons.push(score.seatScore >= 10 ? 'Compatible seating preference' : 'Seating preference noted');
  return reasons;
}

async function getMatches(req, res, next) {
  try {
    const { source, destination, travelDate, foodPreference, seatPreference } = req.query;
    if (!destination || !travelDate || !foodPreference || !seatPreference) {
      return res.status(400).json({ message: 'destination, travelDate, foodPreference and seatPreference are required.' });
    }
    if (!['Vegetarian', 'Non-Vegetarian'].includes(foodPreference)) {
      return res.status(400).json({ message: 'Invalid food preference.' });
    }
    if (!['Vegetarian Only', 'Non-Vegetarian Allowed'].includes(seatPreference)) {
      return res.status(400).json({ message: 'Invalid seat preference.' });
    }

    // Step 1: travels matching destination + date (+ source if given)
    const filter = { destination: new RegExp('^' + destination.trim() + '$', 'i') };
    if (source) filter.source = new RegExp('^' + source.trim() + '$', 'i');
    let travels = await Travel.find(filter).sort({ travelDate: 1 });
    travels = travels.filter((t) => sameDay(t.travelDate, travelDate));

    if (travels.length === 0) {
      return res.json({ matches: [], message: 'No journeys found for this destination and date.' });
    }

    // Step 2: candidate travelers = all users except requester (if logged in).
    // For demo data this surfaces seeded travelers with real prefs.
    let excludeId = null;
    try {
      const header = req.headers.authorization || '';
      if (header.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'travelmate_dev_secret_change_me');
        excludeId = decoded.id;
      }
    } catch (e) {
      excludeId = null; // matching works without login too
    }
    const userFilter = excludeId ? { _id: { $ne: excludeId } } : {};
    const candidates = await User.find(userFilter).limit(50);

    const matches = [];
    for (const travel of travels) {
      const t = await withAvailability(travel);
      for (const traveler of candidates) {
        const r = foodSeatCompatible(foodPreference, seatPreference, traveler.foodPreference, traveler.seatPreference);
        if (!r.compatible) continue;
        const percentage = 50 + 20 + r.foodScore + r.seatScore; // 90-100
        matches.push({
          travel: t,
          traveler: {
            _id: traveler._id,
            name: traveler.name,
            foodPreference: traveler.foodPreference,
            seatPreference: traveler.seatPreference
          },
          matchPercentage: percentage,
          reasons: buildReasons(t, traveler, r)
        });
      }
    }

    // Best matches first, limit to keep response small and readable
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    res.json({ matches: matches.slice(0, 20) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMatches, foodSeatCompatible };
