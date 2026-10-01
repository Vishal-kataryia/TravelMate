const Travel = require('../models/Travel');
const Booking = require('../models/Booking');

function sameDay(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

async function withAvailability(travel) {
  const bookings = await Booking.find({ travelId: travel._id, bookingStatus: 'Confirmed' }).select('seatNumber');
  const bookedSeats = bookings.map((b) => b.seatNumber);
  return {
    _id: travel._id,
    source: travel.source,
    destination: travel.destination,
    travelDate: travel.travelDate,
    departureTime: travel.departureTime,
    totalSeats: travel.totalSeats,
    price: travel.price,
    bookedSeats,
    availableSeats: travel.totalSeats - bookedSeats.length
  };
}

async function listTravels(req, res, next) {
  try {
    const travels = await Travel.find().sort({ travelDate: 1 });
    const out = [];
    for (const t of travels) out.push(await withAvailability(t));
    res.json({ travels: out });
  } catch (err) {
    next(err);
  }
}

async function getTravel(req, res, next) {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ message: 'Journey not found.' });
    res.json({ travel: await withAvailability(travel) });
  } catch (err) {
    next(err);
  }
}

async function searchTravels(req, res, next) {
  try {
    const { source, destination, travelDate } = req.query;
    const filter = {};
    if (source) filter.source = new RegExp('^' + source.trim() + '$', 'i');
    if (destination) filter.destination = new RegExp('^' + destination.trim() + '$', 'i');
    let travels = await Travel.find(filter).sort({ travelDate: 1 });
    if (travelDate) {
      travels = travels.filter((t) => sameDay(t.travelDate, travelDate));
    }
    const out = [];
    for (const t of travels) out.push(await withAvailability(t));
    res.json({ travels: out });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTravels, getTravel, searchTravels, withAvailability, sameDay };
