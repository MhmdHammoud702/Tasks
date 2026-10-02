import WebhookEvent from "../models/WebhookEvent.js";

export const ReceiveOrderCreated = async (req, res) => {
  const { event, data } = req.body ?? {};

  if (
    event !== "order.created" ||
    typeof data?.name !== "string" ||
    typeof data?.amount !== "number" 
  ) {
    return res.status(400).json({
      message: 'Expected an "order.created" event with order name and amount'
    });
  }

  try {
    const savedEvent = await WebhookEvent.create({ event, data });
    console.log("webhook delivered successfully(order-created)");
    return res.status(200).json({ received: true, id: savedEvent.id });
  } catch (error) {
    console.error("Failed to store webhook event:", error);
    return res.status(500).json({ message: "Failed to store webhook event" });
  }
};


export const GetEvents = async (req, res) => {
  try {
    const events = await WebhookEvent.find({}).sort({ receivedAt: -1 }).lean();
    return res.status(200).json(events);
  } catch (error) {
    console.error("Failed to retrieve webhook events:", error);
    return res.status(500).json({ message: "Failed to retrieve webhook events" });
  }
};
