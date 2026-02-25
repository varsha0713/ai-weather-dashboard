const express = require("express");
const { runWeatherAgent } = require("../ai/agent");
const authMiddleware = require("../middleware/authMiddleware");
const City = require("../models/City");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 🔥 Fetch cities from DB using logged-in user
    
    console.log("User ID:", req.user.id);
    const cities = await City.find({userId: req.user.id});
    console.log("Cities from DB:", cities)

    const result = await runWeatherAgent(cities, question);

    res.json({ response: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI agent error" });
  }
});

module.exports = router;