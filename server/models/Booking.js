const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    travelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Travel', required: true },
    seatNumber: { type: String, required: true, trim: true },
    foodPreference: { type: String, required: true, enum: ['Vegetarian', 'Non-Vegetarian'] },
    seatPreference: { type: String, required: true, enum: ['Vegetarian Only', 'Non-Vegetarian Allowed'] },
    matchedTravelerId: { type: String, default: null },
    matchedTravelerName: { type: String, default: null },
    price: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
  },
  { timestamps: true }
);

// Prevent the same seat being booked twice for the same travel (only enforced
// at application level for Confirmed bookings, but index helps lookups).
bookingSchema.index({ travelId: 1, seatNumber: 1, bookingStatus: 1 });
bookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
