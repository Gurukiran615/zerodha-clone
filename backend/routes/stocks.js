const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.TWELVEDATA_API_KEY;
const BASE_URL = "https://api.twelvedata.com";

// Search stocks by name/symbol
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query required" });

    const response = await axios.get(`${BASE_URL}/symbol_search`, {
      params: { symbol: q, apikey: API_KEY },
    });

    const results = (response.data.data || [])
      .filter((item) => item.exchange === "NSE")
      .map((item) => ({
        symbol: item.symbol,
        name: item.instrument_name,
        exchange: item.exchange,
      }));

    res.json(results);
  } catch (err) {
    console.log("Search error:", err.response?.data || err.message);
    res.status(500).json({ message: "Search failed" });
  }
});

// Get live quote for a specific symbol
router.get("/quote/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const response = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol, exchange: "NSE", apikey: API_KEY },
    });

    const data = response.data;

    if (data.code) {
      // Twelve Data returns an error object with a "code" field on failure
      return res
        .status(400)
        .json({ message: data.message || "Quote fetch failed" });
    }

    res.json({
      symbol: data.symbol,
      name: data.name,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      changePercent: parseFloat(data.percent_change),
      isDown: parseFloat(data.change) < 0,
    });
  } catch (err) {
    console.log("Quote error:", err.response?.data || err.message);
    res.status(500).json({ message: "Quote fetch failed" });
  }
});

module.exports = router;
