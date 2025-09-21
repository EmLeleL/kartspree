import express from "express";
import Kart from "../models/Kart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Helper: format kart item for frontend
 */
const formatKartItem = (item,host) => ({
  _id: item._id, // cart entry id
  productId: item.product?._id || null,
  product: item.product?.product || "",
  title: item.product?.title || "",
  description: item.product?.description || "",
  summary: item.product?.summary || "",
  // Ensure price is numeric (fallback 0)
  price: typeof item.product?.price === "number" ? item.product.price : Number(item.product?.price) || 0,
  rating: item.product?.rating || 0,
  // Build a full URL for the first image (if available)
  image: item.product?.img1 ? `${host}/uploads/${item.product.img1}` : null,
  img1: item.product?.img1 || null,
  img2: item.product?.img2 || null,
  img3: item.product?.img3 || null,
  img4: item.product?.img4 || null,
  category: item.product?.category || null,
  quantity: item.quantity,
});

/**
 * @route   GET /api/kart
 * @desc    Get kart items for logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const host = `${req.protocol}://${req.get("host")}`; // for image URLs
    const kart = await Kart.find({ user: userId }).populate("product");

    const formatted = kart.map((i) => formatKartItem(i, host));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/kart
 * @desc    Add item to kart for logged-in user
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1} = req.body;

    if (!itemId) return res.status(400).json({ message: "itemId is required" });

    let kartItem = await Kart.findOne({ user: userId, product: itemId });

    if (kartItem) {
      kartItem.quantity += Number(quantity);
      await kartItem.save();
    } else {
      kartItem = new Kart({ user: userId, product: itemId, quantity });
      await kartItem.save();
    }

    // populate and format before returning
    await kartItem.populate("product");
    const host = `${req.protocol}://${req.get("host")}`;
    res.status(201).json(formatKartItem(kartItem,host));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/kart/:itemId
 * @desc    Update quantity of a kart item
 * @access  Private
 */
router.put("/:itemId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity == null) return res.status(400).json({ message: "quantity is required" });
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const kartItem = await Kart.findOneAndUpdate(
      { _id: itemId, user: userId },
      { quantity: Number(quantity) },
      { new: true }
    ).populate("product");

    if (!kartItem) {
      return res.status(404).json({ message: "Kart item not found" });
    }

    const host = `${req.protocol}://${req.get("host")}`;
    res.json(formatKartItem(kartItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/kart/:itemId
 * @desc    Remove an item from the kart
 * @access  Private
 */
router.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const deletedItem = await Kart.findOneAndDelete({
      _id: itemId,
      user: userId,
    }).populate("product");

    if (!deletedItem) {
      return res.status(404).json({ message: "Kart item not found" });
    }

    const host = `${req.protocol}://${req.get("host")}`;
    res.json({
      message: "Item removed",
      deletedItem: formatKartItem(deletedItem,host),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
