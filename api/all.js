const { connect, Order } = require("../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connect();

    const url = new URL(req.url, "http://localhost");
    const admin = url.searchParams.get("admin");

    if (admin !== "true") {
      res.status(400).json({ message: "Admin access required" });
      return;
    }

    const orders = await Order.find({}).populate("userId", "name email").lean();

    res.json(orders);
  } catch (err) {
    console.error("all error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
