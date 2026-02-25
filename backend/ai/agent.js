




const axios = require("axios");
const { ChatOllama } = require("@langchain/community/chat_models/ollama");

async function runWeatherAgent(cities, question) {
  if (!cities || cities.length === 0) {
    return "You don't have any cities added yet.";
  }

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "phi3",
    temperature: 0.1, // lower = more consistent
  });

  const lowerQuestion = question.toLowerCase();

  // 🔍 Detect mentioned city
  const mentionedCity = cities.find(city =>
    lowerQuestion.includes(city.name.toLowerCase())
  );

  // 🌟 If asking best, compare all cities
  const isBestQuery = lowerQuestion.includes("best");

  let weatherData = [];

  // 🔹 Case 1: Specific city
  if (mentionedCity && !isBestQuery) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${mentionedCity.name}&units=metric&appid=${process.env.WEATHER_API_KEY}`
      );

      weatherData.push({
        name: mentionedCity.name,
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        condition: response.data.weather[0].description
      });

    } catch {
      return "Could not fetch live weather data.";
    }
  }

  // 🔹 Case 2: Best city query → fetch all
  if (isBestQuery) {
    for (let city of cities) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${process.env.WEATHER_API_KEY}`
        );

        weatherData.push({
          name: city.name,
          temperature: response.data.main.temp,
          humidity: response.data.main.humidity,
          condition: response.data.weather[0].description
        });

      } catch {
        console.log("Weather fetch error:", city.name);
      }
    }
  }

  // ❌ If user asked about city not in dashboard
  if (!mentionedCity && !isBestQuery) {
    return "That city is not in your dashboard.";
  }

  const formattedData = weatherData.map(city =>
    `${city.name}: ${city.temperature}°C, ${city.humidity}% humidity, ${city.condition}`
  ).join("\n");

  const prompt = `
You are a precise weather assistant.

Weather data:
${formattedData}

User question:
${question}

Rules:
- Maximum 2 short sentences.
- Always include temperature and humidity.
- Classify comfort strictly as: Comfortable, Moderate, or Uncomfortable.
- Do not give personal opinions.
- Do not use phrases like "for some people".
- Base answer ONLY on provided data.
`;

  try {
  const result = await model.invoke(prompt);
  return result.content;
} catch (error) {
  console.error("AI error:", error);
  return "AI is temporarily unavailable. Please try again.";
}
}

module.exports = { runWeatherAgent };