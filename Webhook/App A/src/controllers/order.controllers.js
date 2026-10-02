import Order from "../models/Order.js";

const MAX_WEBHOOK_ATTEMPTS = 3;

export const CreateOrder = async (req, res) => {
  try {
    const order = await Order.create({
      name: req.body?.name,
      amount: req.body?.amount
    });
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log(`Order ${order.id} was created, but WEBHOOK_SECRET is not configured`);
      return res.status(201).json(order);
    }

    const payload = JSON.stringify({
      event: "order.created",
      data: {
        name: order.name,
        amount: order.amount
      }
    });

    for (let attempt = 1; attempt <= MAX_WEBHOOK_ATTEMPTS; attempt++) {
      let succeeded = false;
      let retryable = true;

      try {
        const response = await fetch("http://localhost:4000/webhooks/order-created", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret
          },
          body: payload
        });

        succeeded = response.ok;
        retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      } catch {
        retryable = true;
      }

      if (succeeded) {
        console.log(`Webhook attempt ${attempt} succeeded`);
        console.log("Webhook delivered successfully");
        break;
      }

      console.log(`Webhook attempt ${attempt} failed`);
      if (!retryable || attempt === MAX_WEBHOOK_ATTEMPTS) {
        console.log('webhook delivery failed');
        break;
      };

      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
    }

    res.status(201).json(order);
  } catch (error) {
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
