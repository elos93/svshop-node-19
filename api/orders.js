const { connect, Order } = require("../lib/db");

module.exports = async (req, res) => {
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
};
