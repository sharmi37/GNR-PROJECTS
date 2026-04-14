import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    axios.get("/api/items?status=available").then((r) => setItems(r.data.slice(0, 4)));
    axios.get("/api/gold-rates").then((r) => setRates(r.data));
  }, []);

  const iconImages = {
    necklace: "./images/neckless1.jpg",
    ring: "./images/ring1.jpg",
    bangles: "./images/bangle.jpg",
    earrings: "./images/ear1.jpg",
    chain: "./images/chain.png",
    bracelet: "./images/bracelet.png",
    other: "./images/other.png",
  };
  const iconEmojis = { necklace: "💎", ring: "💍", bangles: "⭕", earrings: "✨", chain: "🔗", bracelet: "📿", other: "🏅" };

  return (
    <>
      {/* Ticker */}
      <div style={{ background: "#0d0202", borderBottom: "1px solid var(--border)", padding: "8px 2rem", display: "flex", gap: "3rem", overflow: "hidden" }}>
        {rates.map((r) => (
          <span key={r.karat} style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "2px", color: "var(--text-gold)", whiteSpace: "nowrap" }}>
            {r.karat} <span style={{ color: "var(--gold-light)" }}>₹{Number(r.rate_per_gram).toLocaleString()}/g</span>
          </span>
        ))}
        <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "2px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          Live Gold Rates — Coimbatore
        </span>
      </div>

      {/* Hero */}
      <div className="gv-hero">
        <div className="hero-ring" style={{ width: 200, height: 200 }} />
        <div className="hero-ring" style={{ width: 300, height: 300, animationDelay: "1s" }} />
        <div className="hero-ring" style={{ width: 400, height: 400, animationDelay: "2s" }} />
        <img src="./images/logo.png" alt="GNR Gold Traders Logo" />
        <p className="animate-fade" style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "6px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Trusted Gold Experts — Est. 2024
        </p>
        <h1 className="shimmer-text animate-fade-2" style={{ fontSize: "clamp(28px, 5vw, 52px)", marginBottom: "0.75rem" }}>
          G N R GOLD TRADERS
        </h1>
        <p className="animate-fade-3" style={{ fontSize: "18px", color: "var(--text-gold)", fontStyle: "italic", marginBottom: "2.5rem", maxWidth: 500, margin: "0 auto 2.5rem" }}>
          Pledge your gold, sell old jewellery, get instant cash — safe &amp; transparent
        </p>
        <div className="animate-fade-4" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-gold" onClick={() => navigate("/pledges")}>Pledge Jewellery</button>
          <button className="btn-outline-gold" onClick={() => navigate("/sales")}>Sell Gold</button>
          <button className="btn-outline-gold" onClick={() => navigate("/items")}>Browse Collection</button>
        </div>
      </div>

      {/* Services */}
      <div className="gv-page" style={{ paddingTop: "3rem" }}>
        <p className="section-tag">What We Offer</p>
        <h2 className="section-title">Our Premium Services</h2>
        <div className="gold-divider-sm" />

        <div className="service-grid">
          {[
            { icon: "💍", title: "Pledge Gold", desc: "Get instant cash loan against your gold jewellery at best rates", action: () => navigate("/pledges") },
            { icon: "💰", title: "Sell Gold", desc: "Sell your old jewellery at the best market price today", action: () => navigate("/sales") },
            { icon: "🏪", title: "Buy Jewellery", desc: "Certified pre-owned gold jewellery at affordable prices", action: () => navigate("/items") },
            { icon: "🔓", title: "Release Gold", desc: "Redeem your pledged items with flexible repayment options", action: () => navigate("/pledges") },
          ].map((s, i) => (
            <div key={i} className="service-item animate-fade" style={{ animationDelay: `${i * 0.1}s` }} onClick={s.action}>
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div>
          <p>
            <div>

            </div>
          </p>
        </div>

        {/* How it works */}
<p className="section-tag">Simple Process</p>
<h2 className="section-title">How It Works</h2>
<div className="gold-divider-sm" />

<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
  alignItems: "center",
  marginBottom: "2rem"
}}>
  {/* LEFT BLOCK — text + button */}
  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
    {[
      { step: "01", title: "Bring Your Gold", desc: "Visit our store with your jewellery and valid ID proof" },
      { step: "02", title: "Free Valuation",  desc: "Our experts assess purity, weight, and current market rate" },
      { step: "03", title: "Get Cash Instantly", desc: "Receive cash, UPI, or bank transfer immediately" },
      { step: "04", title: "Redeem Anytime",  desc: "Pay back the loan amount + interest to get your gold back" },
    ].map((s, i) => (
      <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          color: "rgba(212,175,55,0.3)",
          minWidth: "48px",
          lineHeight: 1
        }}>
          {s.step}
        </div>


        <div>
          <p style={{
            fontSize: "13px",
            letterSpacing: "1.5px",
            color: "var(--text-gold)",
            margin: "0 0 4px",
            textTransform: "uppercase",
            fontFamily: "var(--font-display)"
          }}>
            {s.title}
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
            {s.desc}
          </p>
        </div>
      </div>
    ))}

    {/* Button */}
    <div style={{ marginTop: "0.5rem" }}>
      <button className="btn-gold" onClick={() => navigate("/pledges")}>
        Start Pledging Now
      </button>
    </div>
  </div>

  {/* RIGHT BLOCK — full image */}
  <div style={{
    width: "100%",
    height: "420px",
    borderRadius: "4px",
    overflow: "hidden",
    border: "1px solid var(--border)"
  }}>
    <img
      src="./images/p1.jpeg"
      alt="Gold pledging process"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.parentElement.style.background = "rgba(212,175,55,0.05)";
      }}
    />
  </div>
</div>

        <div className="gold-divider" />

        {/* How it works */}
        <p className="section-tag">Simple Process</p>
        <h2 className="section-title">How It Works</h2>
        <div className="gold-divider-sm" />

        <div className="row g-4 mb-4">
          {[
            { step: "01", title: "Bring Your Gold", desc: "Visit our store with your jewellery and valid ID proof" },
            { step: "02", title: "Free Valuation", desc: "Our experts assess purity, weight, and current market rate" },
            { step: "03", title: "Get Cash Instantly", desc: "Receive cash, UPI, or bank transfer immediately" },
            { step: "04", title: "Redeem Anytime", desc: "Pay back the loan amount + interest to get your gold back" },
          ].map((s, i) => (
            <div key={i} className="col-md-3">
              <div className="gv-card animate-fade" style={{ animationDelay: `${i * 0.1}s`, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "rgba(212,175,55,0.2)", marginBottom: "0.5rem" }}>{s.step}</div>
                <h5 style={{ fontSize: "12px", letterSpacing: "2px", marginBottom: "0.5rem" }}>{s.title}</h5>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="gold-divider" />

        {/* Products */}
        <p className="section-tag">Available Now</p>
        <h2 className="section-title">Featured Collection</h2>
        <div className="gold-divider-sm" />

        <div className="row g-3 mb-4">
          {items.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center" }}>No items available. Add inventory first.</p>
          )}
          {items.map((item, i) => (
            <div key={item.id} className="col-md-3">
              <div className="product-card animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>

                {/* ✅ Fixed: img tag with emoji fallback */}
                <div className="product-card-img">
                  <img
                    src={iconImages[item.category] || iconImages.other}
                    alt={item.category}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "block";
                    }}
                    style={{ width: "300px", height: "170px", objectFit: "cover" }}
                  />
                  <span style={{ display: "none", fontSize: "48px" }}>
                    {iconEmojis[item.category] || "🏅"}
                  </span>
                </div>

                <div className="product-card-body">
                  <h4>{item.name}</h4>
                  <p>{item.karat} — {item.weight_grams}g</p>
                  <div className="price">₹{Number(item.market_price).toLocaleString()}</div>
                  <button className="btn-sm-gold" style={{ width: "100%" }} onClick={() => navigate("/items")}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "3rem", textAlign: "center", marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Ready to Get Instant Cash?</h2>
           <img src="./images/carousil1.jpg" alt="GNR Gold Traders Logo" />
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem" }}>
            No hidden charges. Transparent rates. Trusted by thousands in Coimbatore.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-gold" onClick={() => navigate("/pledges")}>Pledge Now</button>
            <button className="btn-outline-gold" onClick={() => navigate("/customers")}>Register as Customer</button>
          </div>
        </div>
      </div>
    </>
  );
}