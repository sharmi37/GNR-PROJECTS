import { useEffect, useState } from "react";
import API from "API";
import { toast } from "react-toastify";

const empty = { name: "", phone: "", email: "", address: "", id_proof: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => API.get("/api/customers").then((r) => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/api/customers/${editId}`, form);
        toast.success("Customer updated");
      } else {
        await API.post("/api/customers", form);
        toast.success("Customer added");
      }
      setForm(empty); setEditId(null); load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Error");
    }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, phone: c.phone, email: c.email || "", address: c.address || "", id_proof: c.id_proof || "" });
    setEditId(c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="gv-page">
      <p className="section-tag">Manage</p>
      <h2 className="section-title" style={{ textAlign: "left" }}>Customers</h2>
      <div className="gold-divider" />

      {/* Form */}
      <div className="gv-card animate-fade mb-4" style={{ maxWidth: 700 }}>
        <h5 style={{ marginBottom: "1.5rem", fontSize: "12px", letterSpacing: "3px" }}>
          {editId ? "Edit Customer" : "Register New Customer"}
        </h5>
        <div className="row g-3">
          {[
            { label: "Full Name *", key: "name", type: "text" },
            { label: "Phone *", key: "phone", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "ID Proof (Aadhar/PAN)", key: "id_proof", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key} className="col-md-6">
              <div className="gv-form-group">
                <label className="gv-label">{label}</label>
                <input
                  type={type}
                  className="gv-input"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={label}
                />
              </div>
            </div>
          ))}
          <div className="col-12">
            <div className="gv-form-group">
              <label className="gv-label">Address</label>
              <textarea
                className="gv-textarea"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-gold" onClick={handleSubmit}>
            {editId ? "Update Customer" : "Register Customer"}
          </button>
          {editId && (
            <button className="btn-outline-gold" onClick={() => { setForm(empty); setEditId(null); }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search & List */}
      <div className="gv-form-group" style={{ maxWidth: 300, marginBottom: "1rem" }}>
        <input
          type="text"
          className="gv-input"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gv-card">
        <div className="gv-table-wrap">
          <table className="gv-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Phone</th><th>Email</th>
                <th>ID Proof</th><th>Registered</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.id_proof || "—"}</td>
                  <td>{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                  <td>
                    <button className="btn-sm-gold" onClick={() => handleEdit(c)}>Edit</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={7} style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)" }}>No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
