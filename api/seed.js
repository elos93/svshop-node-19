const { connect, Product } = require("../lib/db");

module.exports = async (req, res) => {
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
};
