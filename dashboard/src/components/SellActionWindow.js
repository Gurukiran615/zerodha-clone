import React, { useState, useContext } from "react";
import API from "../api/axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, currentPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(currentPrice || 0.0);

  const generalContext = useContext(GeneralContext);

  const handleSellClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    const minAllowed = currentPrice * 0.98;
    const maxAllowed = currentPrice * 1.02;

    if (price < minAllowed || price > maxAllowed) {
      alert(
        `Price must be close to the current market price (₹${currentPrice.toFixed(2)}). Allowed range: ₹${minAllowed.toFixed(2)} - ₹${maxAllowed.toFixed(2)}`,
      );
      return;
    }

    try {
      await API.post("/newOrder", {
        name: uid,
        qty,
        price,
        mode: "SELL",
      });

      alert("Stock Sold Successfully");
      generalContext.closeSellWindow();
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Sell Failed");
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(Number(e.target.value))}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹0</span>
        <div>
          <button
            type="button"
            className="btn btn-red"
            onClick={handleSellClick}
          >
            Sell
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
