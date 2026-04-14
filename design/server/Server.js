
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

pool.getConnection()
  .then(conn => {
    console.log(" MySQL connected successfully");
    conn.release();
  })
  .catch(err => {
    console.error(" MySQL Error:", err.message);
    console.error("Error code:", err.code);
  });

app.get("/api/gold-rates", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gold_rates");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/gold-rates/:karat", async (req, res) => {
  try {
    const { rate_per_gram } = req.body;
    await pool.query(
      "UPDATE gold_rates SET rate_per_gram=? WHERE karat=?",
      [rate_per_gram, req.params.karat]
    );
    res.json({ message: "Rate updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/customers", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id=?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/customers", async (req, res) => {
  try {
    const { name, phone, email, address, id_proof } = req.body;
    const [result] = await pool.query(
      "INSERT INTO customers (name,phone,email,address,id_proof) VALUES (?,?,?,?,?)",
      [name, phone, email, address, id_proof]
    );
    res.status(201).json({ id: result.insertId, message: "Customer added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const { name, phone, email, address, id_proof } = req.body;
    await pool.query(
      "UPDATE customers SET name=?,phone=?,email=?,address=?,id_proof=? WHERE id=?",
      [name, phone, email, address, id_proof, req.params.id]
    );
    res.json({ message: "Customer updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/items", async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = "SELECT * FROM jewellery_items WHERE 1=1";
    const params = [];
    if (status) { query += " AND status=?"; params.push(status); }
    if (category) { query += " AND category=?"; params.push(category); }
    query += " ORDER BY created_at DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, category, karat, weight_grams, description, market_price } = req.body;
    const [result] = await pool.query(
      "INSERT INTO jewellery_items (name,category,karat,weight_grams,description,market_price) VALUES (?,?,?,?,?,?)",
      [name, category, karat, weight_grams, description, market_price]
    );
    res.status(201).json({ id: result.insertId, message: "Item added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const { name, category, karat, weight_grams, description, market_price, status } = req.body;
    await pool.query(
      "UPDATE jewellery_items SET name=?,category=?,karat=?,weight_grams=?,description=?,market_price=?,status=? WHERE id=?",
      [name, category, karat, weight_grams, description, market_price, status, req.params.id]
    );
    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM jewellery_items WHERE id=?", [req.params.id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PLEDGES ─────────────────────────────────────────────────
app.get("/api/pledges", async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT p.*, c.name AS customer_name, c.phone,
             j.name AS item_name, j.karat, j.weight_grams
      FROM pledges p
      JOIN customers c ON p.customer_id = c.id
      JOIN jewellery_items j ON p.item_id = j.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { query += " AND p.status=?"; params.push(status); }
    query += " ORDER BY p.created_at DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/pledges/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS customer_name, c.phone, c.email, c.address,
              j.name AS item_name, j.karat, j.weight_grams, j.category
       FROM pledges p
       JOIN customers c ON p.customer_id = c.id
       JOIN jewellery_items j ON p.item_id = j.id
       WHERE p.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/pledges", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { customer_id, item_id, loan_amount, interest_rate, pledge_date, due_date, remarks } = req.body;
    const pledge_number = "PLG" + Date.now();
    const [result] = await conn.query(
      "INSERT INTO pledges (pledge_number,customer_id,item_id,loan_amount,interest_rate,pledge_date,due_date,remarks) VALUES (?,?,?,?,?,?,?,?)",
      [pledge_number, customer_id, item_id, loan_amount, interest_rate || 2.0, pledge_date, due_date, remarks]
    );
    await conn.query("UPDATE jewellery_items SET status='pledged' WHERE id=?", [item_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, pledge_number, message: "Pledge created" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.put("/api/pledges/:id/release", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [pledges] = await conn.query("SELECT * FROM pledges WHERE id=?", [req.params.id]);
    if (!pledges.length) return res.status(404).json({ error: "Not found" });
    await conn.query("UPDATE pledges SET status='released' WHERE id=?", [req.params.id]);
    await conn.query("UPDATE jewellery_items SET status='available' WHERE id=?", [pledges[0].item_id]);
    await conn.commit();
    res.json({ message: "Pledge released" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.put("/api/pledges/:id/extend", async (req, res) => {
  try {
    const { new_due_date } = req.body;
    await pool.query(
      "UPDATE pledges SET due_date=?, status='extended' WHERE id=?",
      [new_due_date, req.params.id]
    );
    res.json({ message: "Pledge extended" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SALES ───────────────────────────────────────────────────
app.get("/api/sales", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, j.name AS item_name, j.karat, j.weight_grams,
             c.name AS customer_name
      FROM sales s
      JOIN jewellery_items j ON s.item_id = j.id
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sales", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { item_id, customer_id, sale_price, sale_type, sale_date, payment_mode } = req.body;
    const [result] = await conn.query(
      "INSERT INTO sales (item_id,customer_id,sale_price,sale_type,sale_date,payment_mode) VALUES (?,?,?,?,?,?)",
      [item_id, customer_id, sale_price, sale_type || "new", sale_date, payment_mode || "cash"]
    );
    await conn.query("UPDATE jewellery_items SET status='sold' WHERE id=?", [item_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, message: "Sale recorded" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ─── DASHBOARD STATS ─────────────────────────────────────────
app.get("/api/dashboard", async (req, res) => {
  try {
    const [[activePledges]] = await pool.query(
      "SELECT COUNT(*) AS count, COALESCE(SUM(loan_amount),0) AS total FROM pledges WHERE status='active'"
    );
    const [[totalSales]] = await pool.query(
      "SELECT COUNT(*) AS count, COALESCE(SUM(sale_price),0) AS total FROM sales"
    );
    const [[availableItems]] = await pool.query(
      "SELECT COUNT(*) AS count FROM jewellery_items WHERE status='available'"
    );
    const [[totalCustomers]] = await pool.query(
      "SELECT COUNT(*) AS count FROM customers"
    );
    res.json({
      active_pledges: activePledges.count,
      pledge_value: activePledges.total,
      total_sales: totalSales.count,
      sales_revenue: totalSales.total,
      available_items: availableItems.count,
      total_customers: totalCustomers.count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GoldVault server running on port ${PORT}`));
