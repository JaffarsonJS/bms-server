const express = require("express");
const {
  getDashboardData,
  addNoteData,
  deletedNoteData,
  postPDF,
  getPDF,
} = require("../controllers/dashboardController");
const upload = require("../config/pdfConfig");
const path = require("path");

const router = express.Router();

router.get("/dashboard-data", getDashboardData);
router.post("/dashboard-data", upload.single("pdf"), postPDF);
router.post("/dashboard-data/add-note", addNoteData);
router.delete("/dashboard-data", deletedNoteData);

router.get("/download/:name", (req, res) => {
  const filename = req.params.name;
  const location = __dirname.split("routes")[0];
  const filePath = path.join(location, "assets", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error during download:", err);
      res.status(404).send("File not found.");
    }
  });
});

module.exports = router;
