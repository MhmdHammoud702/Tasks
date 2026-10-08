import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  idempotencyKey: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

OrderSchema.index(
  { idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: "string" } }
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
