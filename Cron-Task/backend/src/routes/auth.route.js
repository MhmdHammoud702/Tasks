import express from "express";
import { Login, Registor } from "../controllers/auth.controllers.js";
import rateLimit from "express-rate-limit";
const router = express.Router();

const loginlimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: "Too many login attempts, please try again later.",
});

const registorlimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  message: "Too many registration attempts, please try again later.",
});

router.post("/login", loginlimiter, Login);
router.post("/registor", registorlimiter, Registor);

export default router;