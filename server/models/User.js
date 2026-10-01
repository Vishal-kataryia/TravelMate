const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    foodPreference: { type: String, required: true, enum: ['Vegetarian', 'Non-Vegetarian'] },
    seatPreference: { type: String, required: true, enum: ['Vegetarian Only', 'Non-Vegetarian Allowed'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
