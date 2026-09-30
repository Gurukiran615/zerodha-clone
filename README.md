# Zerodha Clone

A full-stack stock trading platform inspired by Zerodha, built with the MERN stack. Includes user authentication, a live watchlist with real-time market data search, portfolio holdings/positions tracking, and order placement .

## Live Demo

| Service                  | Link                                          |
| ------------------------ | --------------------------------------------- |
| Landing / Login / Signup | https://zerodha-clone-frontend-one.vercel.app |
| Trading Dashboard        | https://zerodha-clone-dashboard-mu.vercel.app |
| Backend API              | https://zerodha-backend-j6zw.onrender.com     |

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-60 seconds to respond.

## Features

- **Authentication** — signup/login with JWT-based session handling, secured with a server-side secret (not exposed in code).
- **Live stock search** — search any NSE-listed stock by name or symbol and add it to your watchlist with a real-time quote (via Twelve Data API).
- **Watchlist** — add/remove stocks, view live price and % change, persisted locally per browser session.
- **Order placement** — buy/sell stocks with quantity and price, validated against the live market price (±2% tolerance) to prevent invalid orders.
- **Holdings & Positions** — automatically tracked per user, with correct weighted-average cost calculation across repeat purchases.
- **Order history** — full record of past orders, scoped to the logged-in user.
- **Per-user data isolation** — each user only sees their own holdings, positions, and orders.

## Tech Stack

- **Frontend:** React, React Router
- **Dashboard:** React, MUI (Material UI), Chart.js
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JSON Web Tokens (JWT), bcrypt for password hashing
- **Market Data:** Twelve Data API
- **Deployment:** Vercel (frontend + dashboard), Render (backend), MongoDB Atlas (database)

## Architecture

This is a three-service application:

1. **`frontend/`** — public landing page, signup, and login. On successful login, redirects to the dashboard with a JWT token passed via URL parameter.
2. **`dashboard/`** — the authenticated trading interface (Holdings, Positions, Orders, Funds, Watchlist with live search).
3. **`backend/`** — Express REST API handling auth, orders, holdings, positions, and a proxy to the Twelve Data market API.

All three are deployed independently and communicate over HTTPS with CORS configured to allow only the known frontend/dashboard origins.

## Getting Started (Local Setup)

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB instance)
- A free [Twelve Data API key](https://twelvedata.com)

### 1. Clone the repo

```bash
git clone https://github.com/Gurukiran615/zerodha-clone.git
cd zerodha-clone
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
TWELVEDATA_API_KEY=your_twelvedata_api_key
PORT=3002
```

Run it:

```bash
npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

### 4. Dashboard setup

```bash
cd dashboard
npm install
npm start
```

## License

This project is for educational/portfolio purposes only and is not affiliated with Zerodha Broking Ltd.
