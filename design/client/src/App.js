import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Customers from "./Customers";
import Items from "./Items";
import Pledges from "./Pledges";
import Sales from "./Sales";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/items" element={<Items />} />
        <Route path="/pledges" element={<Pledges />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{ background: "#200808", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}
      />
    </Router>
  );
}

export default App;
