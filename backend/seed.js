import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
dotenv.config();

const seedUsers = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Eve Wilson",
  "Frank Castle",
  "Grace Hopper",
  "Henry Ford",
  "Ivy League",
  "Jack Ryan",
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/leaderboard",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Cleared existing users");

    const users = await User.insertMany(
      seedUsers.map((name) => ({ name, totalPoints: 0 }))
    );

    console.log(`Seeded ${users.length} users:`);
    users.forEach((user) => {
      console.log(`- ${user.name} (ID: ${user._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
