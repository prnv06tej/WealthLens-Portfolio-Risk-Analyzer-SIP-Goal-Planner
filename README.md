# WealthLens Portfolio Manager (V1)

WealthLens is a full-stack, production-grade personal fintech application designed to eliminate human error in investment tracking. Unlike standard portfolio trackers that rely on manual entry of fractional asset numbers, WealthLens shifts the burden of calculation entirely to a robust backend engine. 

By integrating live Net Asset Value (NAV) data matching structures, long-only regulatory constraints, and custom brokerage models, WealthLens provides clean, real-time analytics for retail investments.

## 🚀 Core Features (Version 1)

* **Internal Unit Allocation Engine:** Users simply enter their transaction capital amounts. The backend dynamically fetches live fund NAV tracking vectors to compute down to three decimal places of fractional asset accuracy.
* **Long-Only Risk Safeguards:** Prevents portfolio balance vulnerabilities by strictly blocking negative values, zero inputs, short-selling anomalies, or overdraft liquidation events.
* **Dynamic Brokerage Fee Scaling:** Features an adaptive transaction cost engine. Users can input custom processing fees (defaulting to a clean `0.05%`) which dynamically scale asset acquisition sizes for `BUY` entries or liquidation requirements for `SELL` redemptions.
* **Real-Time Asset Diversification:** Automatically groups holdings by tactical strategy categories (`Large Cap`, `Mid Cap`, `Small Cap`, `Debt`, `Flexi Cap`) and maps aggregate distributions instantly onto interactive visual telemetry.
* **Irregular Cash-Flow Optimization:** Lays down a mathematical framework for true annualized return computing (XIRR) utilizing a Newton-Raphson approximation engine over historical ledger timelines.

## 🛠️ The Tech Stack

* **Frontend Client:** React (Vite), Recharts (Data Visualizations), Lucide React (Iconography), Axios (Secure HTTP Pipelines).
* **Backend Runtime:** Node.js, Express.js, Node-Cron (Automated Background Syncs).
* **Database Architecture:** MongoDB Atlas (Mongoose ODM).
* **Security Protocol:** JSON Web Tokens (JWT) embedded across a global route encapsulation middleware shield (`protect`).

## 📂 System Architecture Overview

```text
├── fintech-backend/
│   ├── src/
│   │   ├── config/          # Database connection strings
│   │   ├── controllers/     # Investment calculations & ledger logs
│   │   ├── middlewares/     # JWT authentication shields
│   │   ├── models/          # Strict validation schemas (Transaction, Portfolio, Fund)
│   │   ├── routes/          # Clean API route mapping modules
│   │   └── utils/           # AMFI parsers & mathematical engines
│   └── server.js            # Main Express execution entry point
│
└── fintech-frontend/
    ├── src/
    │   ├── components/      # Responsive navigation layouts
    │   ├── utils/           # Global Axios API interceptor configurations
    │   ├── pages/           # Visual analytics dashboards & auth forms
    │   └── App.jsx          # React Router client routing gateway
```

## ⚙️ Getting Started & Installation

### Prerequisites
* Node.js (v16.x or higher)
* MongoDB Atlas cluster connection string

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/WealthLens_Portfolio_Manager.git](https://github.com/your-username/WealthLens_Portfolio_Manager.git)
cd WealthLens_Portfolio_Manager
```

### 2. Configure the Backend Environment
Navigate to the `fintech-backend` directory, create a `.env` file, and populate it with your environment variables:
```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_high_entropy_secret_string
```

Install backend dependencies and spin up the local development engine:
```bash
npm install
npm run dev
```

### 3. Launch the Frontend UI Client
Navigate to the `fintech-frontend` directory, install the node dependency modules, and start the Vite local dev server:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to interact with the investment dashboard panel.

## 📈 Next Up for Version 2
* [ ] Live AMFI Parser automation via daily structural endpoint cron syncs.
* [ ] Real-time XIRR data point injection across long-term asset span histories.
* [ ] Full-scale multi-asset support extending to stocks and cash reserves.