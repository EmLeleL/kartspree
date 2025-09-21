// latest working server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/auth.js";
import kartRoutes from "./routes/kart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const router = express.Router();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Serve uploaded profile pictures
app.use("/uploads", express.static("uploads"));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilepic');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// API endpoint to handle profile picture upload
app.post("/api/auth/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.json({
    message: "Profile picture uploaded successfully.",
    profilePicUrl: `/uploads/profilepic/${req.file.filename}`,
  });
});


// routes
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/kart", kartRoutes);
app.use("/api/orders", orderRoutes);

// connect DB (use the same URI you used before)
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  }
}
start();