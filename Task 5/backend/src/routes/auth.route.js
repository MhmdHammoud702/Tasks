import express from "express";
import { CreateToken } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/",CreateToken);

export default router;