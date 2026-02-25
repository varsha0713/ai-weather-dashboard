# AI-Powered Weather Dashboard

## 🚀 Project Overview

This is a full-stack AI-powered weather dashboard that enables
authenticated users to manage multiple cities, view real-time weather
data, and interact with an AI assistant for contextual insights.

Each user has fully isolated data. Cities, favorites, and AI responses
are scoped per authenticated user to ensure personalization and
security.

The application demonstrates secure authentication, RESTful
architecture, third-party API integration, and structured AI
orchestration using a local LLM.

------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   Next.js -- Optimized React framework with server-side rendering
-   Tailwind CSS -- Utility-first CSS framework for responsive UI

### Backend

-   Node.js -- Runtime environment
-   Express.js -- REST API framework
-   MongoDB -- NoSQL database for flexible data storage
-   JWT -- Stateless authentication mechanism
-   bcryptjs -- Secure password hashing

### AI Layer

-   LangChain -- LLM orchestration and prompt structuring
-   Ollama (Phi-3 Local Model) -- Local AI inference engine

### External API

-   OpenWeather API -- Real-time weather data provider

------------------------------------------------------------------------

## 🏗 High-Level Architecture

1.  User interacts with Next.js frontend.
2.  Frontend sends authenticated requests (JWT token) to Express
    backend.
3.  Backend validates JWT and fetches user-scoped data from MongoDB.
4.  Weather data is retrieved from OpenWeather API.
5.  AI assistant uses LangChain to structure prompts and query the Phi-3
    model via Ollama.
6.  AI response is returned to the frontend.

Architecture Flow:

Frontend → Express API → MongoDB\
Frontend → Express API → OpenWeather API\
Frontend → Express API → LangChain → Ollama → AI Response

------------------------------------------------------------------------

## 🔐 Authentication & Authorization

-   Users register using email and password.
-   Passwords are hashed using bcryptjs before storing in MongoDB.
-   On login, a JWT token is generated.
-   Protected routes require JWT validation middleware.
-   Data queries are filtered by user ID to ensure user-level isolation.

Security Approach: - Stateless authentication - Secure password
storage - Scoped database queries

------------------------------------------------------------------------

## 🤖 AI Agent Design & Purpose

The AI assistant provides contextual weather insights such as: -
Recommendations for outdoor activities - Best time suggestions - Comfort
analysis explanation

LangChain is used to: - Structure prompts - Inject real-time weather
data - Generate contextual AI responses

Phi-3 (via Ollama) processes the prompt locally to ensure privacy and
cost efficiency.

------------------------------------------------------------------------

## ✨ Creative / Custom Features

### 1️⃣ Best Today Scoring Algorithm

A custom scoring system evaluates: - Temperature - Humidity - Wind
speed - Weather conditions

It calculates a daily score to rank cities.

### 2️⃣ Comfort Classification

Cities are classified as: - Comfortable - Moderate - Uncomfortable

Based on predefined weather thresholds.

### 3️⃣ Personalized Dynamic Greeting

Greeting dynamically changes based on: - Time of day - Current weather
condition

------------------------------------------------------------------------

## ⚙ Setup Instructions (Local)

### 1. Clone Repository

``` bash
git clone <repo-url>
cd weather-dashboard
```

### 2. Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file:

    MONGO_URI=your_mongodb_connection
    JWT_SECRET=your_secret_key
    OPENWEATHER_API_KEY=your_api_key

Run backend:

``` bash
npm start
```

### 3. Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

### 4. AI Setup

Install Ollama from: https://ollama.com

Pull Phi-3 model:

``` bash
ollama pull phi3
```

Run model:

``` bash
ollama run phi3
```

------------------------------------------------------------------------

## 🚀 Deployment Setup

Frontend: - Deploy using Vercel

Backend: - Deploy using Render or Railway

Database: - Use MongoDB Atlas

Note: Ollama must run locally or on an AI-enabled server environment.

------------------------------------------------------------------------

## 🎯 Key Design Decisions & Trade-offs

-   JWT Authentication chosen for stateless scalability.
-   MongoDB used for flexible schema design.
-   Local LLM used to avoid API costs and improve privacy.
-   REST architecture chosen for simplicity.

Trade-offs: - Requires local resources for AI processing. - No refresh
token mechanism implemented. - Not optimized for high-scale production
traffic.

------------------------------------------------------------------------

## ⚠ Known Limitations

-   AI responses depend on local model performance.
-   Weather accuracy depends on OpenWeather API reliability.
-   Ollama requires manual setup.
-   No rate limiting implemented yet.

------------------------------------------------------------------------

## 📌 Future Improvements

-   Add refresh token mechanism
-   Implement caching for weather data
-   Add real-time updates using WebSockets
-   Improve AI memory handling




🌐 Deployment Status

The application is fully functional locally.

Due to the AI layer running via Ollama (local LLM), full cloud deployment requires additional containerization and model hosting configuration.

Frontend and backend can be deployed independently, but AI currently runs locally for cost-efficiency and privacy.

------------------------------------------------------------------------

## 👩‍💻 Author

Varsha Acharya\
Full-Stack Developer \| AI Enthusiast \| 2025 Graduate
