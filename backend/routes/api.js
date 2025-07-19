import express from "express";
import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";

const router = express.Router();

// GET /users - Get all users sorted by totalPoints (descending)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /users - Add a new user
router.post("/users", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ name: name.trim() });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /claim - Award random points to a user
router.post("/claim", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate random points between 1-10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1;

    // Update user's total points
    user.totalPoints += pointsAwarded;
    await user.save();

    // Create claim history record
    const claimHistory = new ClaimHistory({
      userId: user._id,
      pointsAwarded,
      timestamp: new Date(),
    });
    await claimHistory.save();

    // Emit real-time update to all connected clients
    const io = req.app.get("io");
    const updatedUsers = await User.find().sort({ totalPoints: -1 });
    io.emit("leaderboardUpdate", updatedUsers);

    res.json({
      userId: user._id,
      pointsAwarded,
      newTotal: user.totalPoints,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /history/:userId - Get claim history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await ClaimHistory.find({ userId })
      .sort({ timestamp: -1 })
      .populate("userId", "name");

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
