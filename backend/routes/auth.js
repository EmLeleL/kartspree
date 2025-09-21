import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: "uploads/profilepic/" });

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({ name, email, password: hashedPassword});
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePic: `http://localhost:5000${user.profilePic || "/uploads/profilepic/glep.jpg"}` } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROFILE
router.put("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    };

    if (req.file) {
      updates.profilePic = `/uploads/profilepic/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");   // <-- do not send password back

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PROFILE (return user details including address)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router