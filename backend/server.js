
require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cityRoutes = require("./routes/city");


const aiRoutes = require("./routes/ai");



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/ai", aiRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Weather Dashboard API Running");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});