import express from "express";
import { GetEvents, ReceiveOrderCreated } from "../controllers/webhooks.controllers.js";

const router = express.Router();

router.post("/order-created", ReceiveOrderCreated);
router.get("/events", GetEvents);

export default router;
