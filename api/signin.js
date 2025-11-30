const { connect, User } = require("../lib/db");

module.exports = async (req, res) => {
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
};
