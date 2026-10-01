const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    travelDate: { type: Date, required: true },
    departureTime: { type: String, required: true, default: '08:00 AM' },
    totalSeats: { type: Number, required: true, default: 32 },
    price: { type: Number, required: true, default: 999 }
  },
  { timestamps: true }
);

travelSchema.index({ destination: 1, travelDate: 1 });

module.exports = mongoose.model('Travel', travelSchema);
