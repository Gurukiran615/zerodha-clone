import React, { useState, useContext } from "react";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";
import API from "../api/axios";

const BuyActionWindow = ({ uid, currentPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(currentPrice || 0.0);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    // Allow a small tolerance around the live price (±2%)
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
        mode: "BUY",
      });

      alert("Stock Bought Successfully");
      generalContext.closeBuyWindow();
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert(err.response?.data || "Buy Failed");
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
          >
            Buy
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

export default BuyActionWindow;
