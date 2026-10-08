import Order from "../models/Order.js";

export const CreateOrder = async (req, res) => {
  try {
    const idempotencyKey = req.get("Idempotency-Key")?.trim();
    if (!idempotencyKey || idempotencyKey.length > 255) {
      return res.status(400).json({
        message: "A valid Idempotency-Key header is required"
      });
    }

    const { name, amount } = req.body ?? {};
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      if (existingOrder.name !== name || existingOrder.amount !== amount) {
        return res.status(409).json({
          message: "Idempotency-Key was already used with different order data"
        });
      }

      return res.status(200).json(existingOrder);
    }

    const order = await Order.create({
      idempotencyKey,
      name,
      amount
    });
    return res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000) {
      try {
        const idempotencyKey = req.get("Idempotency-Key")?.trim();
        const existingOrder = await Order.findOne({ idempotencyKey });

        if (
          existingOrder &&
          existingOrder.name === req.body?.name &&
          existingOrder.amount === req.body?.amount
        ) {
          return res.status(200).json(existingOrder);
        }

        if (existingOrder) {
          return res.status(409).json({
            message: "Idempotency-Key was already used with different order data"
          });
        }
      } catch (lookupError) {
        console.error("Failed to retrieve order for idempotency key:", lookupError);
        return res.status(500).json({ message: "Failed to verify order request" });
      }
    }

    const status = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const DeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ receivedAt: -1 }).lean();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};
