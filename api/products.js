const { connect, Product } = require("../lib/db");

module.exports = async (req, res) => {
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
};
