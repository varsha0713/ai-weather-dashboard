const express = require("express");
const axios = require("axios");
const City = require("../models/City");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================= ADD CITY =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
  return res.status(400).json({ message: "City name is required" });
}
const existingCity = await City.findOne({
  name: new RegExp(`^${name}$`, "i"),
  userId: req.user._id
});

if (existingCity) {
  return res.status(400).json({ message: "City already added" });
}

    const newCity = new City({
      name,
      userId: req.user._id
    });

    await newCity.save();

    res.status(201).json({ message: "City added successfully", city: newCity });

  } catch (error) {
    res.status(500).json({ message: "Error adding city", error });
  }
});


// ================= GET USER CITIES =================
router.get("/", authMiddleware, async (req, res) => {
  try {
   const cities = await City.find({ userId: req.user._id })
  .sort({ isFavorite: -1, createdAt: -1 });

    const citiesWithWeather = await Promise.all(
      cities.map(async (city) => {
        try {
          const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${process.env.WEATHER_API_KEY}`
          );

          return {
            ...city._doc,
            weather: {
              temperature: weatherRes.data.main.temp,
              description: weatherRes.data.weather[0].description,
              humidity: weatherRes.data.main.humidity
            }
          };
        } catch (err) {
          return {
            ...city._doc,
            weather: { error: "Weather data not available" }
          };
        }
      })
    );

    res.json(citiesWithWeather);

  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
});


// ================= TOGGLE FAVORITE =================
router.put("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const city = await City.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.isFavorite = !city.isFavorite;
    await city.save();

    res.json({ message: "Favorite status updated", city });

  } catch (error) {
    res.status(500).json({ message: "Error updating favorite", error });
  }
});


// ================= DELETE CITY =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const city = await City.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting city", error });
  }
});

module.exports = router;