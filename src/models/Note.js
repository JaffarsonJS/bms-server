const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  detail: String
});

module.exports = mongoose.model('Note', noteSchema);