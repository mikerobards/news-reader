// filepath: /Users/michaelrobards/Documents/Projects/ztm/vibe-coding/news-reader/server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5177;
const API_KEY = process.env.NEWS_API_KEY;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send(
    "News Reader API is active. Frontend is running on a different port (usually 5173).",
  );
});

app.get("/api/news", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Server missing API Key" });
  }

  const { search, categories, page } = req.query;
  const pageParam = page || 1;
  const categoryParam = categories || "tech";

  // Base params
  const params = {
    api_token: API_KEY,
    language: "en",
    limit: 3,
    page: pageParam,
  };

  // Filter logic: If search exists, ignore categories
  if (search) {
    params.search = search;
    params.sort = "published_at";
  } else {
    params.categories = categoryParam;
  }

  try {
    const response = await axios.get("https://api.thenewsapi.com/v1/news/all", {
      params,
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // Proxy upstream errors
      const status = error.response.status;
      if (status === 401 || status === 403) {
        return res
          .status(status)
          .json({ error: "Authentication failed with news provider" });
      }
      if (status === 429) {
        return res
          .status(429)
          .json({ error: "Rate limit reached. Please try again later." });
      }
      return res.status(status).json(error.response.data);
    }
    console.error("Proxy Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the Express API
module.exports = app;

// Only listen when running locally (not in Vercel serverless environment)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
