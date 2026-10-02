import { timingSafeEqual } from "node:crypto";

export const verifyWebhookSecret = (req, res, next) => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error("WEBHOOK_SECRET is not configured");
    return res.status(500).json({ message: "Webhook authentication is not configured" });
  }

  const expected = Buffer.from(secret);
  const provided = Buffer.from(req.get("X-Webhook-Secret") ?? "");

  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    console.log('webhook request rejected (security issues)');
    return res.status(401).json({ message: "webhook request rejected (security issues)" });
  }

  return next();
};
