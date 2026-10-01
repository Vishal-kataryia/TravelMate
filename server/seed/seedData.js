require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Travel = require('../models/Travel');
const Booking = require('../models/Booking');

function dateInFuture(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelmate';
  await mongoose.connect(uri);
  console.log('Connected for seeding');

  await User.deleteMany({});
  await Travel.deleteMany({});
  await Booking.deleteMany({});

  const password = await bcrypt.hash('Demo@123', 10);

  const demoUsers = [
    { name: 'Demo User', email: 'demo@travelmate.com', phone: '9999999999', password, foodPreference: 'Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Rahul Sharma', email: 'rahul@demo.com', phone: '9811111111', password, foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only' },
    { name: 'Priya Singh', email: 'priya@demo.com', phone: '9822222222', password, foodPreference: 'Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Amit Kumar', email: 'amit@demo.com', phone: '9833333333', password, foodPreference: 'Non-Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Neha Verma', email: 'neha@demo.com', phone: '9844444444', password, foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only' },
    { name: 'Arjun Mehta', email: 'arjun@demo.com', phone: '9855555555', password, foodPreference: 'Non-Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Anjali Gupta', email: 'anjali@demo.com', phone: '9866666666', password, foodPreference: 'Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Rohit Sharma', email: 'rohit@demo.com', phone: '9877777777', password, foodPreference: 'Non-Vegetarian', seatPreference: 'Non-Vegetarian Allowed' },
    { name: 'Sneha Patel', email: 'sneha@demo.com', phone: '9888888888', password, foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only' }
  ];

  const users = await User.insertMany(demoUsers);
  console.log(`Created ${users.length} users`);

  // Use fixed future dates so matching demos are predictable.
  // Travel date used across spec examples: 15 October 2026.
  const oct15 = new Date(2026, 9, 15);
  if (oct15 < new Date()) {
    // If that date has passed, fall back to +15 days so demo still works.
    const fallback = dateInFuture(15);
    console.log('Note: Oct 15 2026 has passed, using fallback date', fallback.toDateString());
  }
  const goaDate = oct15 > new Date() ? oct15 : dateInFuture(15);
  const otherDate = new Date(goaDate);
  otherDate.setDate(otherDate.getDate() + 2);

  const travels = await Travel.insertMany([
    { source: 'Delhi', destination: 'Goa', travelDate: goaDate, departureTime: '08:00 AM', totalSeats: 32, price: 1499 },
    { source: 'Delhi', destination: 'Jaipur', travelDate: goaDate, departureTime: '09:30 AM', totalSeats: 32, price: 799 },
    { source: 'Delhi', destination: 'Manali', travelDate: goaDate, departureTime: '07:00 PM', totalSeats: 32, price: 1199 },
    { source: 'Mumbai', destination: 'Goa', travelDate: goaDate, departureTime: '10:00 AM', totalSeats: 32, price: 999 },
    { source: 'Delhi', destination: 'Kerala', travelDate: otherDate, departureTime: '06:00 AM', totalSeats: 32, price: 1999 },
    { source: 'Delhi', destination: 'Mumbai', travelDate: otherDate, departureTime: '11:00 AM', totalSeats: 32, price: 1299 }
  ]);
  console.log(`Created ${travels.length} journeys`);

  // Mark a few seats as booked so seat selection demo shows booked seats.
  const rahul = users.find((u) => u.email === 'rahul@demo.com');
  await Booking.create([
    { bookingId: 'TM-DEMO-000001', userId: rahul._id, travelId: travels[0]._id, seatNumber: 'A1', foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only', price: travels[0].price, bookingStatus: 'Confirmed' },
    { bookingId: 'TM-DEMO-000002', userId: rahul._id, travelId: travels[0]._id, seatNumber: 'A2', foodPreference: 'Vegetarian', seatPreference: 'Vegetarian Only', price: travels[0].price, bookingStatus: 'Confirmed' }
  ]);
  console.log('Created 2 demo bookings (A1, A2 booked on Delhi -> Goa)');

  console.log('\nSeed complete!');
  console.log('Demo login: demo@travelmate.com / Demo@123');
  console.log(`Goa demo date: ${goaDate.toDateString()}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
