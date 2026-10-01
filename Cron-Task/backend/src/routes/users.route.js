import express from "express";
import {  DeleteAllUser, DeleteUser, GetAllUsers, GetUser } from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/", GetAllUsers);
router.get("/:id", GetUser);
router.delete("/:id", DeleteUser);
router.delete("/", DeleteAllUser);

export default router;