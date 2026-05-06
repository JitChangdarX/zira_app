import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import Owner from "./models/owner.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
await connectDB();

// Routes
app.post("/signup-post-user", async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new Owner({
      name: user_name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Server error",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
