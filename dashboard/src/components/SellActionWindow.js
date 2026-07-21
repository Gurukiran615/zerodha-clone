import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css"; // reuse same styling

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const generalContext = useContext(GeneralContext);

  const handleSellClick = async () => {
    try {
      await API.post("/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });

      alert("Stock Sold Successfully ");

      generalContext.closeSellWindow();
    } catch (err) {
      console.log(err);
      alert("Sell Failed ");
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
