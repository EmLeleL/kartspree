import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to the User model
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item", // link to Item model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true } // automatically adds createdAt, updatedAt
);

const Kart = mongoose.model("Kart", cartSchema);
export default Kart;
