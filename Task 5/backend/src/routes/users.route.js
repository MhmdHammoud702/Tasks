import express from "express";
import { AddUser, Delete, DeleteAll, GetUsers, Update } from "../controllers/users.controller.js";
const router = express.Router();

router.post("/",AddUser);
router.put("/:id",Update);
router.get('/',GetUsers);
router.delete("/:id",Delete);
router.delete('/',DeleteAll)

export default router;