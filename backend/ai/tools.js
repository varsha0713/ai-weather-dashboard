const axios = require("axios");

async function getWeatherForCity(cityName) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );

    return {
      city: cityName,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed
    };
  } catch (error) {
    return { error: "Unable to fetch weather data" };
  }
}

module.exports = { getWeatherForCity };