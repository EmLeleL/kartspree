// latest working itemRoutes.js
import express from "express";
import mongoose from "mongoose";
import Item from "../models/Item.js";

const router = express.Router();

// latest added
// helper to produce full image URLs (uses current request host)
const toFullImageUrl = (req, filename) => {
  if (!filename) return null;
  const host = `${req.protocol}://${req.get("host")}`;
  // if filename already starts with /uploads or http, be safe:
  if (filename.startsWith("/")) return `${host}${filename}`;
  if (filename.startsWith("http")) return filename;
  return `${host}/uploads/${filename}`;
};

/**
 * GET /api/items/search?q=...&category=...&min=...&max=...
 * (Must be defined BEFORE /:id)
 */
router.get("/search", async (req, res) => {
  try {
    const { q, category, min, max } = req.query;

    const filter = {};
    if (q) {
      const re = new RegExp(q, "i");
      // search title, product or category by name
      filter.$or = [
        { title: re },
        { product: re },
        { category: re },
      ];
    }
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const items = await Item.find(filter).lean();

    const withUrls = items.map((i) => ({
      ...i,
      img1: toFullImageUrl(req, i.img1),
      img2: toFullImageUrl(req, i.img2),
      img3: toFullImageUrl(req, i.img3),
      img4: toFullImageUrl(req, i.img4),
    }));

    res.json(withUrls);
  } catch (err) {
    console.error("GET /api/items/search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const items = await Item.find().lean();
    const withUrls = items.map((i) => ({
      ...i,
      img1: i.img1 ? `${i.img1}` : null,
      img2: i.img2 ? `${i.img2}` : null,
      img3: i.img3 ? `${i.img3}` : null,
      img4: i.img4 ? `${i.img4}` : null,
    }));
    res.json(withUrls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }
  try {
    const item = await Item.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({
      ...item,
      img1: item.img1 ? `${item.img1}` : null,
      img2: item.img2 ? `${item.img2}` : null,
      img3: item.img3 ? `${item.img3}` : null,
      img4: item.img4 ? `${item.img4}` : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;