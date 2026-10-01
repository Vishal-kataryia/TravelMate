const Booking = require('../models/Booking');
const Travel = require('../models/Travel');

function makeBookingId() {
  const d = new Date();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `TM-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${rand}`;
}

function isValidSeat(seat, totalSeats) {
  if (typeof seat !== 'string') return false;
  const m = seat.trim().toUpperCase().match(/^([AB])(\d+)$/);
  if (!m) return false;
  const num = parseInt(m[2], 10);
  const perSide = Math.floor(totalSeats / 2);
  return num >= 1 && num <= perSide;
}

async function createBooking(req, res, next) {
  try {
    const { travelId, seatNumber, foodPreference, seatPreference, matchedTravelerId, matchedTravelerName } = req.body;
    if (!travelId || !seatNumber || !foodPreference || !seatPreference) {
      return res.status(400).json({ message: 'travelId, seatNumber, foodPreference and seatPreference are required.' });
    }
    const travel = await Travel.findById(travelId);
    if (!travel) return res.status(404).json({ message: 'Journey not found.' });

    const seat = String(seatNumber).trim().toUpperCase();
    if (!isValidSeat(seat, travel.totalSeats)) {
      return res.status(400).json({ message: 'Invalid seat number.' });
    }

    // CRITICAL: backend double-booking check. Never trust the frontend.
    const existing = await Booking.findOne({ travelId: travel._id, seatNumber: seat, bookingStatus: 'Confirmed' });
    if (existing) {
      return res.status(409).json({ message: 'This seat is already booked.' });
    }

    const booking = await Booking.create({
      bookingId: makeBookingId(),
      userId: req.user._id,
      travelId: travel._id,
      seatNumber: seat,
      foodPreference,
      seatPreference,
      matchedTravelerId: matchedTravelerId || null,
      matchedTravelerName: matchedTravelerName || null,
      price: travel.price,
      bookingStatus: 'Confirmed'
    });

    res.status(201).json({ booking, message: 'Booking confirmed!' });
  } catch (err) {
    next(err);
  }
}

async function myBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('travelId')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

async function getBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate('travelId').populate('userId', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (String(booking.userId._id || booking.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this booking.' });
    }
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (String(booking.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }
    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }
    booking.bookingStatus = 'Cancelled';
    await booking.save();
    res.json({ booking, message: 'Booking cancelled. Your seat is now available again.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, myBookings, getBooking, cancelBooking };
