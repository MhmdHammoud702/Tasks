import express from "express";
import { CreateOrder, DeleteOrder,GetOrders } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/", CreateOrder);
router.delete("/:id", DeleteOrder);
router.get('/',GetOrders)

export default router;
