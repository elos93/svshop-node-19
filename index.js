const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const { connect, User, Product, Order } = require("./lib/db");

const app = express();

app.use(cors());
app.use(express.json());

// נגיש את קבצי ה-HTML וה-CSS מהשורש
app.use(express.static(path.join(__dirname)));

// ---- בדיקה בסיסית ----
app.get("/api/test", (req, res) => {
  res.json({ message: "API works" });
});

// ---- SIGNUP ----
app.post("/api/signup", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- SIGNIN ----
app.post("/api/signin", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const { email, password } = req.body || {};

    const user = await User.findOne({ email, password });
    if (!user) {
      res
        .status(400)
        .json({ message: "User not registered or wrong password" });
      return;
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.error("signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- PRODUCTS (GET) ----
app.get("/api/products", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- SEED PRODUCTS (POST) ----
app.post("/api/seed", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const count = await Product.countDocuments();
    if (count > 0) {
      res.json({ message: "Products already exist" });
      return;
    }

    await Product.insertMany([
      { name: "bread", price: 15 },
      { name: "milk", price: 23 },
      { name: "gum", price: 3 },
    ]);

    res.json({ message: "Products seeded" });
  } catch (err) {
    console.error("seed error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- ORDERS (POST) ----
app.post("/api/orders", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const { userId, items, totalPrice } = req.body || {};

    if (!userId || !items || !items.length) {
      res.status(400).json({ message: "Missing order data" });
      return;
    }

    const order = await Order.create({ userId, items, totalPrice });
    res.status(201).json({ message: "Order saved", orderId: order._id });
  } catch (err) {
    console.error("orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- ALL ORDERS (ADMIN) ----
app.get("/all", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const { admin } = req.query;
    if (admin !== "true") {
      res.status(400).json({ message: "Admin access required" });
      return;
    }

    const orders = await Order.find({}).populate("userId", "name email").lean();

    res.json(orders);
  } catch (err) {
    console.error("seed error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message, // נוסיף את ההודעה עצמה
      name: err.name, // ושם השגיאה
    });
  }
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
