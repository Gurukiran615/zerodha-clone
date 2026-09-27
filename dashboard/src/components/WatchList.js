import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist as defaultWatchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const API_BASE = "https://zerodha-backend-j6zw.onrender.com"; // same base your axios.js uses

const WatchList = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : defaultWatchlist;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`${API_BASE}/api/stocks/search?q=${value}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // wait 400ms after typing stops before calling API
  };

  const handleAddStock = async (symbol, name) => {
    // Avoid duplicates
    if (watchlist.some((s) => s.name === symbol)) {
      setSearchTerm("");
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/api/stocks/quote/${symbol}`);
      const quote = res.data;

      const newStock = {
        name: quote.symbol,
        displayName: name,
        price: quote.price,
        percent: `${quote.changePercent.toFixed(2)}%`,
        isDown: quote.isDown,
      };

      setWatchlist((prev) => [...prev, newStock]);
    } catch (err) {
      console.error("Failed to fetch quote:", err);
    }

    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveStock = (name) => {
    setWatchlist((prev) => prev.filter((s) => s.name !== name));
  };

  const labels = watchlist.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="counts"> {watchlist.length} / 50</span>

        {searchTerm && (
          <ul className="search-dropdown">
            {isSearching && <li>Searching...</li>}
            {!isSearching && searchResults.length === 0 && <li>No results</li>}
            {!isSearching &&
              searchResults.map((result) => (
                <li
                  key={result.symbol}
                  onClick={() => handleAddStock(result.symbol, result.name)}
                  style={{ cursor: "pointer" }}
                >
                  {result.name} ({result.symbol})
                </li>
              ))}
          </ul>
        )}
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => {
          return (
            <WatchListItem
              stock={stock}
              key={index}
              onRemove={handleRemoveStock}
            />
          );
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>
          {stock.displayName || stock.name}
        </p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <WatchListActions
          uid={stock.name}
          onRemove={() => onRemove(stock.name)}
        />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, onRemove }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
        <Tooltip
          title="Remove"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action" onClick={onRemove}>
            ✕
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
