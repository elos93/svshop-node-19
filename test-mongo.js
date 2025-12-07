// test-mongo.js
require("dotenv").config();
console.log("MONGO_URI from env:", process.env.MONGO_URI); // ← שורה חדשה לבדיקה

const { connect } = require("./lib/db");

(async () => {
  try {
    console.log("Trying to connect to MongoDB...");
    await connect();
    console.log("✅ Mongo connected successfully!");
  } catch (err) {
    console.error("❌ Mongo connection error:");
    console.error("Name:", err.name);
    console.error("Message:", err.message);
  } finally {
    process.exit();
  }
})();
