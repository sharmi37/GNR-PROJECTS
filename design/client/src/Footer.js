export default function Footer() {
  return (
    <footer className="gv-footer">
      <div className="gold-divider" style={{ marginBottom: "1rem" }} />
      <p style={{ marginBottom: "0.5rem", fontSize: "14px", color: "var(--text-gold)" }}>
        GoldVault Pawn &amp; Jewellery
      </p>
      <p>Trusted. Secure. Transparent. — Coimbatore, Tamil Nadu</p>
      <p style={{ marginTop: "0.5rem" }}>© {new Date().getFullYear()} All Rights Reserved</p>
    </footer>
  );
}