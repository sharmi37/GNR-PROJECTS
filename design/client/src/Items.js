import { useEffect, useState } from "react";
import API from "./Api.js";
import { toast } from "react-toastify";

const empty = { name: "", category: "necklace", karat: "22K", weight_grams: "", description: "", market_price: "" };
const icons = { necklace: "💎", ring: "💍", bangles: "⭕", earrings: "✨", chain: "🔗", bracelet: "📿", other: "🏅" };

export default function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = () => API.get("/api/items").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/api/items/${editId}`, form);
        toast.success("Item updated");
      } else {
        await API.post("/api/items", form);
        toast.success("Item added to inventory");
      }
      setForm(empty); setEditId(null); load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/api/items/${id}`);
      toast.success("Item removed");
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name, category: item.category, karat: item.karat,
      weight_grams: item.weight_grams, description: item.description || "",
      market_price: item.market_price, status: item.status,
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="gv-page">
      <p className="section-tag">Manage</p>
      <h2 className="section-title" style={{ textAlign: "left" }}>Jewellery Inventory</h2>
      <div className="gold-divider" />

      {/* Form */}
      <div className="gv-card animate-fade mb-4" style={{ maxWidth: 700 }}>
        <h5 style={{ marginBottom: "1.5rem", fontSize: "12px", letterSpacing: "3px" }}>
          {editId ? "Edit Item" : "Add New Item"}
        </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="gv-form-group">
              <label className="gv-label">Item Name *</label>
              <input className="gv-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gold Necklace" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="gv-form-group">
              <label className="gv-label">Category</label>
              <select className="gv-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["necklace", "ring", "bangles", "earrings", "chain", "bracelet", "other"].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="gv-form-group">
              <label className="gv-label">Karat</label>
              <select className="gv-select" value={form.karat} onChange={(e) => setForm({ ...form, karat: e.target.value })}>
                {["18K", "20K", "22K", "24K"].map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Weight (grams) *</label>
              <input type="number" className="gv-input" value={form.weight_grams} onChange={(e) => setForm({ ...form, weight_grams: e.target.value })} placeholder="e.g. 12.5" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="gv-form-group">
              <label className="gv-label">Market Price (₹) *</label>
              <input type="number" className="gv-input" value={form.market_price} onChange={(e) => setForm({ ...form, market_price: e.target.value })} placeholder="e.g. 65000" />
            </div>
          </div>
          {editId && (
            <div className="col-md-4">
              <div className="gv-form-group">
                <label className="gv-label">Status</label>
                <select className="gv-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {["available", "pledged", "sold"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="col-12">
            <div className="gv-form-group">
              <label className="gv-label">Description</label>
              <textarea className="gv-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Item description, condition, hallmark details..." />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-gold" onClick={handleSubmit}>{editId ? "Update Item" : "Add Item"}</button>
          {editId && <button className="btn-outline-gold" onClick={() => { setForm(empty); setEditId(null); }}>Cancel</button>}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        {["all", "available", "pledged", "sold"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: "none", border: "none", borderBottom: filter === f ? "2px solid var(--gold)" : "2px solid transparent", color: filter === f ? "var(--gold)" : "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer", transition: "color 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <div className="row g-3">
        {filtered.map((item, i) => (
          <div key={item.id} className="col-md-3 col-sm-6">
            <div className="product-card animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="product-card-img">{icons[item.category] || "🏅"}</div>
              <div className="product-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <span className={`badge-${item.status}`}>{item.status}</span>
                </div>
                <p>{item.karat} — {item.weight_grams}g</p>
                <div className="price">₹{Number(item.market_price).toLocaleString()}</div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn-sm-gold" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-danger-gold" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "2rem" }}>No items found.</p>
        )}
      </div>
    </div>
  );
}
