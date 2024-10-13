const mongoose = require("mongoose");

const mngReportAndWorkOrderSchema = new mongoose.Schema({
  name: String,
  reportStartDate: Date,
  reportEndDate: Date,
  pdf: String,
  type: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ManagementReports-workorders", mngReportAndWorkOrderSchema);
