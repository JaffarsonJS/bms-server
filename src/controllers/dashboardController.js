const StatusCard = require("../models/StatusCard.js");
const ItemsRequiringAction = require("../models/ItemsRequiringAction.js");
const mngReportAndWorkOrder = require("../models/mngReportAndWorkOrderSchemas.js");
const Note = require("../models/Note.js");
const ActivityFeeds = require("../models/ActivityFeeds.js");

exports.getDashboardData = async (req, res) => {
  try {
    const queryDate = req.query.date;
    if (!queryDate) {
      return res.status(400).json({ message: "Date parameter is required" });
    }
    const parsedDate = new Date(queryDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const startDate = new Date(
      parsedDate.toISOString().split("T")[0] + "T00:00:00.000Z"
    );
    const endDate = new Date(
      parsedDate.toISOString().split("T")[0] + "T23:59:59.999Z"
    );

    const allStatusCards = await StatusCard.find();
    const formattedStatusCards = allStatusCards
      .map((card) => ({
        _id: card._id,
        title: card.title,
        record: card.record.filter((r) => {
          const recordDate = new Date(r.date);
          return recordDate >= startDate && recordDate <= endDate;
        }),
      }))
      .filter((card) => card.record.length > 0);

    const allItemsRequiringAction = await ItemsRequiringAction.find();
    const formattedItemsRequiringAction = allItemsRequiringAction.filter(
      (item) => {
        const recordDate = new Date(item.date);
        return recordDate >= startDate && recordDate <= endDate;
      }
    );

    const allNotes = await Note.find();
    const formattedNotes = allNotes.filter((note) => {
      const recordDate = new Date(note.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const allReports = await mngReportAndWorkOrder.find();
    const filteredReports = allReports.filter((report) => {
      const reportDate = new Date(report.created);
      return reportDate >= startDate && reportDate <= endDate;
    });

    const activityFeed = await ActivityFeeds.find();
    const activityFeeds = activityFeed.filter((items) => {
      const activityDate = new Date(items.date);
      return activityDate >= startDate && activityDate <= endDate;
    });

    res.json({
      statusCards: formattedStatusCards,
      itemsRequiringAction: formattedItemsRequiringAction || null,
      notes: formattedNotes || null,
      filteredReports,
      activityFeed: activityFeeds,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.addNoteData = async (req, res) => {
  try {
    const { title, detail, date } = req.body;

    if (!title || !detail) {
      return res.status(400).json({ message: "Title and detail are required" });
    }

    const newNote = new Note({
      title,
      detail,
      date: date ? new Date(date) : new Date(),
    });

    const data = await newNote.save();
    res.status(201).json({ message: "Note created successfully", data: data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletedNoteData = async (req, res) => {
  try {
    if (req.method === "DELETE") {
      const noteId = req.query.noteId;

      if (!noteId) {
        return res.status(400).json({ message: "Note ID is required" });
      }

      const deletedNote = await Note.findByIdAndDelete(noteId);

      if (!deletedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      return res.json({ message: "Note deleted successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.postPDF = async (req, res) => {
  try {
    const file = req.file;
    const { name, reportStartDate, reportEndDate, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const newReport = new mngReportAndWorkOrder({
      name,
      reportStartDate: new Date(reportStartDate),
      reportEndDate: new Date(reportEndDate),
      pdf: req.file.path,
      type: type,
    });

    await newReport.save();
    res.status(201).json({ message: "Management Report created successfully" });
  } catch (err) {
    console.error("Error in uploading report:", error);
    res.status(400).json({ message: error.message });
  }
};
