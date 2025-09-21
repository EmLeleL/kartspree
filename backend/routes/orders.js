import express from "express";
import Kart from "../models/Kart.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/orders/checkout
 * @desc    Checkout: create an order from the user's kart
 * @access  Private
 */
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user kart
    const kartItems = await Kart.find({ user: userId }).populate("product");

    if (!kartItems.length) {
      return res.status(400).json({ message: "Kart is empty" });
    }

    // 2. Calculate total
    const items = kartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const total = kartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity + 5,
      0
    );

    // 3. Create order
    const newOrder = new Order({
      user: userId,
      items,
      total,
    });
    await newOrder.save();

    // 4. Clear kart after checkout
    await Kart.deleteMany({ user: userId });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders of logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
