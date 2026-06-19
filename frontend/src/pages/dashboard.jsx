import { useState, useEffect } from "react";
import API from "../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Wallet, ArrowUpRight, TrendingUp, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalInvested: 0,
    currentValue: 0,
    absoluteReturn: 0,
    returnPercentage: 0,
    xirr: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form visibility state toggler
  const [showForm, setShowForm] = useState(false);
  
  // 🌟 UPDATED: Form state optimized for automatic internal calculation tracking
  const [formData, setFormData] = useState({
    fundIsin: "",
    amount: "",
    brokerage: "0.05", // Standard initial fallback percentage 
    transactionDate: "",
    type: "BUY",
  });

  // Local helper state vector to hold real-time unit count estimations
  const [estimatedUnits, setEstimatedUnits] = useState(0);

  // 1. Core mount data pipeline fetch loop
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [summaryRes, txRes] = await Promise.all([
          API.get("/portfolio/summary"),
          API.get("/transactions"),
        ]);

        const innerPayload = summaryRes?.data?.data;

        if (innerPayload && innerPayload.summary) {
          setSummary(innerPayload.summary);
          setAllocation(innerPayload.allocation || []);
        } else {
          setSummary({
            totalInvested: 0,
            currentValue: 0,
            absoluteReturn: 0,
            returnPercentage: 0,
            xirr: 0,
          });
          setAllocation([]);
        }

        setTransactions(txRes?.data?.data || []);
      } catch (err) {
        console.error("Dashboard Asset Verification Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🌟 NEW: Dynamic local unit estimator engine
  useEffect(() => {
    const computeLiveEstimation = async () => {
      const amt = parseFloat(formData.amount);
      const feePercent = parseFloat(formData.brokerage) || 0;
      
      if (!formData.fundIsin || isNaN(amt) || amt <= 0) {
        setEstimatedUnits(0);
        return;
      }

      try {
        // Fetch fund target details right from your verified inventory matching array
        const response = await API.get(`/funds/popular`);
        const curatedFunds = response?.data?.data || [];
        const targetedFund = curatedFunds.find(
          (f) => f.isin.trim().toUpperCase() === formData.fundIsin.trim().toUpperCase()
        );

        if (targetedFund && targetedFund.currentNAV) {
          const feeMultiplier = feePercent / 100;
          let calculatedUnits = 0;

          if (formData.type === "BUY") {
            const netAmount = amt * (1 - feeMultiplier);
            calculatedUnits = netAmount / targetedFund.currentNAV;
          } else {
            const netAmount = amt * (1 + feeMultiplier);
            calculatedUnits = netAmount / targetedFund.currentNAV;
          }

          setEstimatedUnits(parseFloat(calculatedUnits.toFixed(3)));
        } else {
          setEstimatedUnits(0);
        }
      } catch (err) {
        setEstimatedUnits(0); // Silent guard on parsing anomalies
      }
    };

    // Debounce/Trigger estimation recalculation anytime form properties shift
    const delayTimer = setTimeout(computeLiveEstimation, 400);
    return () => clearTimeout(delayTimer);
  }, [formData.amount, formData.fundIsin, formData.brokerage, formData.type]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transactions/add", formData);
      alert("Transaction successfully written to ledger!");
      window.location.reload();
    } catch (err) {
      alert(
        "Transaction logging failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const COLORS = ["#0070f3", "#10b981", "#8b5cf6", "#ff4d4d"];

  if (loading)
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        Recalculating absolute metrics and cashflows...
      </div>
    );

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Top Row Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "700", margin: 0 }}>
            Investment Analytics
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Real-time net worth tracking and irregular cash-flow performance metrics.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <PlusCircle size={18} />
          Log Transaction
        </button>
      </div>

      {/* Quick Logging Drawer Form Component */}
      {showForm && (
        <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
          <form
            onSubmit={handleAddTransaction}
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>Fund ISIN</label>
              <input
                type="text"
                placeholder="INF204K01XI3"
                required
                value={formData.fundIsin}
                onChange={(e) => setFormData({ ...formData, fundIsin: e.target.value })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>Amount (₹)</label>
              <input
                type="number"
                placeholder="5000"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>

            {/* 🌟 NEW: Adjustable brokerage field block */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>Brokerage Fee (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.05"
                required
                value={formData.brokerage}
                onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                style={{ padding: "8px", width: "95px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>Date</label>
              <input
                type="date"
                required
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px" }}>Action</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                padding: "9px 18px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Entry
            </button>
          </form>

          {/* 🌟 NEW: Live transaction mathematical preview node info box */}
          {estimatedUnits > 0 && (
            <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#0284c7", background: "#e0f2fe", padding: "8px 12px", borderRadius: "6px", display: "inline-block", fontWeight: "500" }}>
              💡 Real-Time Projection: Executing this {formData.type} order will result in approx <strong>{estimatedUnits} units</strong> logged to your account ledger.
            </div>
          )}
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic", marginTop: "6px" }}>
            * default brokerage metrics applied dynamically inside computing core
          </div>
        </div>
      )}

      {/* Financial Performance Aggregate Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "20px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Current Portfolio Net Worth</span>
            <Wallet size={20} />
          </div>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0 }}>
            ₹{summary.currentValue ? summary.currentValue.toLocaleString("en-IN") : "0"}
          </h3>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Invested Principal: ₹{summary.totalInvested ? summary.totalInvested.toLocaleString("en-IN") : "0"}
          </span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "20px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Absolute Growth</span>
            <ArrowUpRight size={20} color={summary.absoluteReturn >= 0 ? "#16a34a" : "#dc2626"} />
          </div>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0, color: summary.absoluteReturn >= 0 ? "#16a34a" : "#dc2626" }}>
            {summary.absoluteReturn >= 0 ? "+" : ""}₹{summary.absoluteReturn ? summary.absoluteReturn.toLocaleString("en-IN") : "0"}
          </h3>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: summary.absoluteReturn >= 0 ? "#16a34a" : "#dc2626" }}>
            {summary.returnPercentage || "0"}% Total ROI
          </span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "20px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>True Annualized Return (XIRR)</span>
            <TrendingUp size={20} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0, color: "#8b5cf6" }}>
            {summary.xirr || "0"}%
          </h3>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Accounting for timing of cashflows</span>
        </div>
      </div>

      {/* Split Data Charts & Tables Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", alignItems: "start" }}>
        
        {/* Visual Allocation Graph Chart Block */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "20px", borderRadius: "16px" }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "600" }}>Asset Diversification</h4>
          <div style={{ width: "100%", height: 220 }}>
            {allocation.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic" }}>
                No asset splits mapped yet
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={allocation} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Secure Historical Ledger Sheet Table */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "15px 20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: "600" }}>
            Recent Transaction Logs ({transactions.length})
          </div>
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {transactions.length === 0 ? (
              <p style={{ padding: "20px", color: "#64748b", fontStyle: "italic", margin: 0 }}>
                No entries written to Ledger. Log a transaction above to calculate cashflows.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "12px 20px" }}>Date</th>
                    <th style={{ padding: "12px 20px" }}>Fund Profile</th>
                    <th style={{ padding: "12px 20px" }}>Action</th>
                    <th style={{ padding: "12px 20px" }}>Units</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}>Capital Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 20px", color: "#64748b" }}>
                        {new Date(tx.transactionDate).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "12px 20px", fontWeight: "500" }}>
                        {tx.mutualFundId?.name || tx.fundIsin}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span
                          style={{
                            background: tx.type === "BUY" ? "#e6f4ea" : "#fce8e6",
                            color: tx.type === "BUY" ? "#137333" : "#c5221f",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>{tx.units}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: "600" }}>
                        ₹{tx.amount ? tx.amount.toLocaleString("en-IN") : "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}