// seed.js
require("dotenv").config();
const { connect, Product } = require("./lib/db");

async function run() {
  console.log("MONGO_URI from env:", process.env.MONGO_URI);
  console.log("Connecting to MongoDB for seeding...");

  try {
    await connect();
    console.log("✅ Connected, checking products count...");

    const count = await Product.countDocuments();
    console.log("Current products count:", count);

    if (count > 0) {
      console.log("ℹ️ Products already exist, no need to seed.");
      return;
    }

    await Product.insertMany([
      { name: "bread", price: 15 },
      { name: "milk", price: 23 },
      { name: "gum", price: 3 },
    ]);

    console.log("✅ Products seeded successfully!");
  } catch (err) {
    console.error("❌ Seed error:");
    console.error("Name:", err.name);
    console.error("Message:", err.message);
  } finally {
    process.exit(0);
  }
}

run();
