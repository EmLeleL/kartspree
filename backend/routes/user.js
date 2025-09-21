import authMiddleware from "../middleware/authMiddleware.js";

// Get profile
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Update profile
router.put("/me", authMiddleware, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(updated);
});
