import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="gv-navbar">
      <NavLink to="/" className="gv-brand" style={{ textDecoration: "none" }}>
   <img src="./images/logo.png"  alt="logo" style={{ height: "50px", width: "auto" }} />
        
      </NavLink>

      <button
        className="navbar-toggler bg-transparent border-0 ms-auto d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#gvMenu"
        style={{ color: "var(--gold)", fontSize: "20px" }}
      >
        ☰
      </button>

      <div className="collapse navbar-collapse d-lg-flex ms-auto" id="gvMenu">
        <div className="d-flex flex-column flex-lg-row gap-1 mt-3 mt-lg-0">
          {[
            { to: "/", label: "Home" },
            { to: "/dashboard", label: "Dashboard" },
            { to: "/pledges", label: "Pledge Gold" },
            { to: "/sales", label: "Sales" },
            { to: "/items", label: "Inventory" },
            { to: "/customers", label: "Customers" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                "gv-nav-link" + (isActive ? " active" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}