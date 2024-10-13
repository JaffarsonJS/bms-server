const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  time: String,
  description: String,
});

const logSchema = new mongoose.Schema({
  date: String, 
  user: String,
  entries: [entrySchema],
});

const ActivityFeeds = mongoose.model('ActivityFeeds', logSchema);

module.exports = ActivityFeeds;