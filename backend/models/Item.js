import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    img1: { type: String, default: null },
    img2: { type: String, default: null },
    img3: { type: String, default: null },
    img4: { type: String, default: null }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
