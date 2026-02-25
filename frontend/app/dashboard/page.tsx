
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface City {
  _id: string;
  name: string;
  isFavorite: boolean;
  weather: {
    temperature: number;
    humidity: number;
    description: string;
  };
}

export default function Dashboard() {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCity, setNewCity] = useState("");
  const [adding, setAdding] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [chat, setChat] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [botLoading, setBotLoading] = useState(false);

  // ================= AUTH CHECK =================
  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedName = localStorage.getItem("userName");

  if (!token) {
    router.push("/login");
    return;
  }

  if (storedName) {
    setUserName(storedName);
  }

  fetchCities(token);
}, []);
  // ================= FETCH CITIES =================
  const fetchCities = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/cities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCities(data);
    } catch {
      setError("Could not load cities.");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName"); // 👈 add this
  router.push("/login");
};
  // ================= ADD CITY =================
  const handleAddCity = async () => {
    if (!newCity.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setAdding(true);

      await fetch("http://localhost:5000/api/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCity }),
      });

      setNewCity("");
      fetchCities(token);
    } catch {
      alert("Could not add city");
    } finally {
      setAdding(false);
    }
  };

  // ================= DELETE CITY =================
  const handleDeleteCity = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:5000/api/cities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCities(token);
    } catch {
      alert("Could not delete city");
    }
  };

  // ================= TOGGLE FAVORITE =================
  const handleToggleFavorite = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(
        `http://localhost:5000/api/cities/${id}/favorite`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchCities(token);
    } catch {
      alert("Could not update favorite");
    }
  };

  // ================= BEST CITY LOGIC =================
  const getBestCityId = () => {
    if (cities.length === 0) return null;

    let bestCity = null;
    let bestScore = -Infinity;

    cities.forEach((city) => {
      let score = 0;
      const temp = city.weather.temperature;
      const humidity = city.weather.humidity;

      if (temp >= 20 && temp <= 30) score += 2;
      if (humidity >= 30 && humidity <= 70) score += 2;
      if (temp > 35 || humidity > 85) score -= 2;

      if (score > bestScore) {
        bestScore = score;
        bestCity = city;
      }
    });

    return bestCity?._id;
  };

  const bestCityId = getBestCityId();

  // ================= AI CHAT =================
  const handleAskAI = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const userMessage = message;

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setBotLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.response || "No response" },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "AI error. Please try again." },
      ]);
    } finally {
      setBotLoading(false);
    }
  };

const getComfortDetails = (temp: number, humidity: number) => {
  if (temp >= 20 && temp <= 30 && humidity >= 30 && humidity <= 70) {
    return {
      label: "Comfortable",
      color: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
  }

  if (temp > 35 || humidity > 85) {
    return {
      label: "Uncomfortable",
      color: "bg-red-500/20 text-red-400 border border-red-500/30",
    };
  }

  return {
    label: "Moderate",
    color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};






  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
       <div>
  <h1 className="text-3xl font-bold">Weather Dashboard 🌤️</h1>

  {userName && (
    <p className="text-gray-400 mt-1">
      {getGreeting()},{" "}
      <span className="text-blue-400 font-medium">
        {userName}
      </span>{" "}
      👋
    </p>
  )}
</div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ADD CITY */}
      <div className="mb-6 flex gap-3">
        <input
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city name"
          className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleAddCity}
          disabled={adding}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {adding ? "Adding..." : "Add City"}
        </button>
      </div>

      {/* STATES */}
      {loading && <p className="text-center text-gray-400">Loading cities...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && cities.length === 0 && (
        <p className="text-center text-gray-400">
          No cities added yet. Add your first city!
        </p>
      )}

      <h2 className="text-xl font-semibold mb-4">Your Cities</h2>

      {/* CITY GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div
            key={city._id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 
                       p-6 rounded-2xl shadow-xl 
                       hover:scale-105 transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{city.name}</h2>

              <div className="flex items-center gap-2">
                {city._id === bestCityId && (
                  <span className="bg-green-500/20 text-green-400 
                                   px-3 py-1 rounded-full text-sm font-medium">
                    🏆 Best Today
                  </span>
                )}

                <span
                  onClick={() => handleToggleFavorite(city._id)}
                  className="cursor-pointer text-xl"
                >
                  {city.isFavorite ? "⭐" : "☆"}
                </span>
              </div>
            </div>

            <p>🌡 {city.weather.temperature}°C</p>
            <p>💧 {city.weather.humidity}% humidity</p>
            <p>🌥 {city.weather.description}</p>
            {(() => {
  const comfort = getComfortDetails(
    city.weather.temperature,
    city.weather.humidity
  );

  return (
    <div
      className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${comfort.color}`}
    >
      {comfort.label}
    </div>
  );
})()}

            <button
              onClick={() => handleDeleteCity(city._id)}
              className="mt-4 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* FLOATING AI BUTTON */}
      <button
        onClick={() => setShowBot(!showBot)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 
                   w-14 h-14 rounded-full shadow-lg text-2xl"
      >
        🤖
      </button>

      {/* AI CHAT PANEL */}
      {showBot && (
        <div className="fixed bottom-24 right-6 w-96 bg-slate-800 
                        rounded-xl shadow-2xl border border-slate-700 
                        flex flex-col">
          <div className="bg-slate-700 px-4 py-2 rounded-t-xl font-semibold">
            🌤️ Weather AI Assistant
          </div>

          <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto p-3">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs p-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {botLoading && (
              <div className="text-gray-400 text-sm">AI thinking...</div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your cities..."
              className="flex-1 bg-gray-800 border border-gray-700 
                         rounded-xl px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAskAI}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}