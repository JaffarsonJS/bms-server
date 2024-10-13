const mongoose = require("mongoose");

const itemsRequiringActionSchema = new mongoose.Schema({
  overdueCases: Number,
  contractorInsurance: Number,
  residentInfo: Number,
  overdueMaintenance: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "ItemsRequiringAction",
  itemsRequiringActionSchema
);
