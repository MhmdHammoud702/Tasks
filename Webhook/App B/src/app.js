import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import webhooksRouter from "./routes/webhooks.route.js";
import { verifyWebhookSecret } from "./middleware/verifyWebhookSecret.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/webhooks/order-created", verifyWebhookSecret);
app.use("/webhooks", webhooksRouter);

const port = process.env.PORT || 4000;

try {
  await connectDb();
  app.listen(port, () => {
    console.log(`Webhook server running on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start webhook server:", error);
  process.exitCode = 1;
}