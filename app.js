const express = require("express");
const multer = require("multer");
const cors = require("cors");

const connectDB = require("./src/config/database.js");
const dashboardRoutes = require("./src/routes/dashboardRoutes.routes.js");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("./src/assets", express.static("assets"));
app.use("/api", dashboardRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
