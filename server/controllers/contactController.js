const Contact = require('../models/Contact');

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject and message are required.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email.' });
    }
    const contact = await Contact.create({ name, email, phone: phone || '', subject, message });
    res.status(201).json({ message: 'Thanks for contacting TravelMate!', contact });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact };
