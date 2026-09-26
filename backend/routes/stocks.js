const express = require("express");
const router = express.Router();
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

// Search stocks by name/symbol
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query required" });

    const results = await yahooFinance.search(q);
    // Filter to NSE-listed equities only
    const nseResults = results.quotes
      .filter((item) => item.exchange === "NSI")
      .map((item) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname,
      }));

    res.json(nseResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Search failed" });
  }
});

// Get live quote for a specific symbol
router.get("/quote/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await yahooFinance.quote(symbol);

    res.json({
      symbol: quote.symbol,
      name: quote.shortName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      isDown: quote.regularMarketChange < 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Quote fetch failed" });
  }
});

module.exports = router;
