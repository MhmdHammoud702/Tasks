import mongoose from "mongoose";

const WebhookEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

const WebhookEvent = mongoose.model("WebhookEvent", WebhookEventSchema);
export default WebhookEvent;
