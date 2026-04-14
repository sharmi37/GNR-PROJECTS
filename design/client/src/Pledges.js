import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const today = () => new Date().toISOString().split("T")[0];
const dueDefault = () => { const d = new Date(); d.setMonth(d.getMonth() + 3); return d.toISOString().split("T")[0]; };
const empty = { customer_id: "", item_id: "", loan_amount: "", interest_rate: "2.00", pledge_date: today(), due_date: dueDefault(), remarks: "" };

export default function Pledges() {
  const [pledges, setPledges] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState("all");
  const [extendId, setExtendId] = useState(null);
  const [newDue, setNewDue] = useState("");

  const load = () => {
    axios.get("/api/pledges").then((r) => setPledges(r.data));
    axios.get("/api/customers").then((r) => setCustomers(r.data));
    axios.get("/api/items?status=available").then((r) => setItems(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/pledges", form);
      toast.success(`Pledge created: ${res.data.pledge_number}`);
      setForm(empty); load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error creating pledge");
    }
  };

  const handleRelease = async (id) => {
    if (!window.confirm("Release this pledge? Customer's gold will be returned.")) return;
    try {
      await axios.put(`/api/pledges/${id}/release`);
      toast.success("Pledge released successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error");
    }
  };

  const handleExtend = async (id) => {
    try {
      await axios.put(`/api/pledges/${id}/extend`, { new_due_date: newDue });
      toast.success("Pledge extended");
      setExtendId(null); setNewDue(""); load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error");
    }
  };

  const filtered = filter === "all" ? pledges : pledges.filter((p) => p.status === filter);

  const isOverdue = (due) => new Date(due) < new Date();

  return (
    <div className="gv-page">
      <p className="section-tag">Manage</p>
      <h2 className="section-title" style={{ textAlign: "left" }}>Gold Pledges</h2>
      <div className="gold-divider" />

      {/* Pledge Form */}
      <div className="gv-card animate-fade mb-4" style={{ maxWidth: 700 }}>
        <h5 style={{ marginBottom: "1.5rem", fontSize: "12px", letterSpacing: "3px" }}>New Pledge Application</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="gv-form-group">
              <label className="gv-label">Customer *</label>
              <select className="gv-select" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="gv-form-group">
              <label className="gv-label">Jewellery Item *</label>
              <select className="gv-select" value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
                <option value="">Select item</option>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.karat}, {i.weight_grams}g)</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Loan Amount (₹) *</label>
              <input type="number" className="gv-input" value={form.loan_amount} onChange={(e) => setForm({ ...form, loan_amount: e.target.value })} placeholder="e.g. 50000" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Interest Rate (%/month)</label>
              <input type="number" className="gv-input" value={form.interest_rate} onChange={(e) => setForm({ ...form, interest_rate: e.target.value })} step="0.1" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Pledge Date</label>
              <input type="date" className="gv-input" value={form.pledge_date} onChange={(e) => setForm({ ...form, pledge_date: e.target.value })} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Due Date</label>
              <input type="date" className="gv-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="gv-form-group">
              <label className="gv-label">Remarks</label>
              <input className="gv-input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional notes" />
            </div>
          </div>
        </div>
        <button className="btn-gold" onClick={handleSubmit}>Create Pledge</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        {["all", "active", "released", "extended", "defaulted"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: "none", border: "none", borderBottom: filter === f ? "2px solid var(--gold)" : "2px solid transparent", color: filter === f ? "var(--gold)" : "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "10px 16px", cursor: "pointer", transition: "color 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="gv-card">
        <div className="gv-table-wrap">
          <table className="gv-table">
            <thead>
              <tr>
                <th>Pledge #</th><th>Customer</th><th>Phone</th><th>Item</th>
                <th>Weight</th><th>Loan (₹)</th><th>Rate%</th>
                <th>Pledge Date</th><th>Due Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: "var(--font-display)", fontSize: "11px" }}>{p.pledge_number}</td>
                  <td>{p.customer_name}</td>
                  <td>{p.phone}</td>
                  <td>{p.item_name} ({p.karat})</td>
                  <td>{p.weight_grams}g</td>
                  <td>{Number(p.loan_amount).toLocaleString()}</td>
                  <td>{p.interest_rate}%</td>
                  <td>{new Date(p.pledge_date).toLocaleDateString("en-IN")}</td>
                  <td style={{ color: p.status === "active" && isOverdue(p.due_date) ? "#e08080" : "inherit" }}>
                    {new Date(p.due_date).toLocaleDateString("en-IN")}
                    {p.status === "active" && isOverdue(p.due_date) && <span style={{ marginLeft: 4, fontSize: "9px", color: "#e08080" }}>OVERDUE</span>}
                  </td>
                  <td><span className={`badge-${p.status}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {p.status === "active" && (
                        <>
                          <button className="btn-sm-gold" onClick={() => handleRelease(p.id)}>Release</button>
                          <button className="btn-outline-gold" style={{ fontSize: "9px", padding: "5px 10px" }} onClick={() => { setExtendId(p.id); setNewDue(p.due_date); }}>Extend</button>
                        </>
                      )}
                    </div>
                    {extendId === p.id && (
                      <div style={{ marginTop: 6, display: "flex", gap: 4, flexDirection: "column" }}>
                        <input type="date" className="gv-input" value={newDue} onChange={(e) => setNewDue(e.target.value)} style={{ padding: "4px 8px", fontSize: "13px" }} />
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="btn-sm-gold" onClick={() => handleExtend(p.id)}>Save</button>
                          <button className="btn-danger-gold" onClick={() => setExtendId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={11} style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)" }}>No pledges found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}