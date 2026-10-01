import express from "express";
import upload from "../config/multer.js";
import { AddUser, DeleteAllUser, DeleteUser, GetAllUsers, GetUser } from "../controllers/users.controllers.js";

const router = express.Router();

router.post("/", upload.single("image"), AddUser);
router.get("/", GetAllUsers);
router.get("/:id", GetUser);
router.delete("/:id", DeleteUser);
router.delete("/", DeleteAllUser);

export default router;