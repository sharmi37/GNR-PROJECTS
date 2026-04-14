import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const today = () => new Date().toISOString().split("T")[0];
const empty = { item_id: "", customer_id: "", sale_price: "", sale_type: "new", sale_date: today(), payment_mode: "cash" };

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);

  const load = () => {
    axios.get("/api/sales").then((r) => setSales(r.data));
    axios.get("/api/items?status=available").then((r) => setItems(r.data));
    axios.get("/api/customers").then((r) => setCustomers(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      await axios.post("/api/sales", form);
      toast.success("Sale recorded successfully");
      setForm(empty); load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error recording sale");
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.sale_price), 0);

  return (
    <div className="gv-page">
      <p className="section-tag">Manage</p>
      <h2 className="section-title" style={{ textAlign: "left" }}>Sales</h2>
      <div className="gold-divider" />

      {/* Stat */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-card"><span className="stat-label">Total Sales</span><div className="stat-value">{sales.length}</div></div>
        </div>
        <div className="col-md-3">
          <div className="stat-card"><span className="stat-label">Total Revenue</span><div className="stat-value" style={{ fontSize: "18px" }}>₹{totalRevenue.toLocaleString()}</div></div>
        </div>
      </div>

      {/* Form */}
      <div className="gv-card animate-fade mb-4" style={{ maxWidth: 700 }}>
        <h5 style={{ marginBottom: "1.5rem", fontSize: "12px", letterSpacing: "3px" }}>Record New Sale</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="gv-form-group">
              <label className="gv-label">Item *</label>
              <select className="gv-select" value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
                <option value="">Select item</option>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.karat}, {i.weight_grams}g)</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="gv-form-group">
              <label className="gv-label">Customer</label>
              <select className="gv-select" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">Walk-in / Anonymous</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Sale Price (₹) *</label>
              <input type="number" className="gv-input" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} placeholder="e.g. 65000" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Sale Type</label>
              <select className="gv-select" value={form.sale_type} onChange={(e) => setForm({ ...form, sale_type: e.target.value })}>
                <option value="new">New Sale</option>
                <option value="old_buy">Old Gold Purchase</option>
                <option value="pledge_default">Pledge Default</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Payment Mode</label>
              <select className="gv-select" value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Sale Date</label>
              <input type="date" className="gv-input" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} />
            </div>
          </div>
        </div>
        <button className="btn-gold" onClick={handleSubmit}>Record Sale</button>
      </div>

      {/* Sales list */}
      <div className="gv-card">
        <div className="gv-table-wrap">
          <table className="gv-table">
            <thead>
              <tr>
                <th>#</th><th>Item</th><th>Karat</th><th>Weight</th>
                <th>Customer</th><th>Sale Price (₹)</th><th>Type</th>
                <th>Payment</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.item_name}</td>
                  <td>{s.karat}</td>
                  <td>{s.weight_grams}g</td>
                  <td>{s.customer_name || "—"}</td>
                  <td style={{ color: "var(--gold-light)" }}>{Number(s.sale_price).toLocaleString()}</td>
                  <td style={{ textTransform: "capitalize", fontSize: "12px" }}>{s.sale_type.replace("_", " ")}</td>
                  <td style={{ textTransform: "capitalize" }}>{s.payment_mode.replace("_", " ")}</td>
                  <td>{new Date(s.sale_date).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {!sales.length && (
                <tr><td colSpan={9} style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)" }}>No sales recorded yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}