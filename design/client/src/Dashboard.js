import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pledges, setPledges] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get("/api/dashboard").then((r) => setStats(r.data));
    axios.get("/api/pledges?status=active").then((r) => setPledges(r.data.slice(0, 5)));
    axios.get("/api/sales").then((r) => setSales(r.data.slice(0, 5)));
  }, []);

  const statCards = stats
    ? [
        { label: "Active Pledges", value: stats.active_pledges },
        { label: "Pledge Value", value: "₹" + Number(stats.pledge_value).toLocaleString() },
        { label: "Total Sales", value: stats.total_sales },
        { label: "Sales Revenue", value: "₹" + Number(stats.sales_revenue).toLocaleString() },
        { label: "Available Items", value: stats.available_items },
        { label: "Total Customers", value: stats.total_customers },
      ]
    : [];

  return (
    <div className="gv-page">
      <div className="gv-page-header">
        <p className="section-tag">Overview</p>
        <h2 className="section-title" style={{ textAlign: "left" }}>Dashboard</h2>
        <div className="gold-divider" />
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div key={i} className="col-md-2 col-sm-4 col-6">
            <div className="stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="stat-label">{s.label}</span>
              <div className="stat-value" style={{ fontSize: s.value.toString().length > 8 ? "16px" : "22px" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="gv-card">
            <h5 style={{ marginBottom: "1rem", fontSize: "12px", letterSpacing: "3px" }}>Recent Active Pledges</h5>
            <div className="gv-table-wrap">
              <table className="gv-table">
                <thead>
                  <tr><th>Pledge #</th><th>Customer</th><th>Item</th><th>Loan (₹)</th><th>Due</th></tr>
                </thead>
                <tbody>
                  {pledges.map((p) => (
                    <tr key={p.id}>
                      <td>{p.pledge_number}</td>
                      <td>{p.customer_name}</td>
                      <td>{p.item_name}</td>
                      <td>{Number(p.loan_amount).toLocaleString()}</td>
                      <td>{new Date(p.due_date).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                  {!pledges.length && <tr><td colSpan={5} style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)" }}>No active pledges</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="gv-card">
            <h5 style={{ marginBottom: "1rem", fontSize: "12px", letterSpacing: "3px" }}>Recent Sales</h5>
            <div className="gv-table-wrap">
              <table className="gv-table">
                <thead>
                  <tr><th>Item</th><th>Customer</th><th>Price (₹)</th><th>Date</th><th>Payment</th></tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.item_name}</td>
                      <td>{s.customer_name || "—"}</td>
                      <td>{Number(s.sale_price).toLocaleString()}</td>
                      <td>{new Date(s.sale_date).toLocaleDateString("en-IN")}</td>
                      <td style={{ textTransform: "capitalize" }}>{s.payment_mode}</td>
                    </tr>
                  ))}
                  {!sales.length && <tr><td colSpan={5} style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)" }}>No sales yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}