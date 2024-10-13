const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  value: Number,
  date: { type: Date, default: Date.now }
});

const statusCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  record: [recordSchema]
});

module.exports = mongoose.model('StatusCard', statusCardSchema);