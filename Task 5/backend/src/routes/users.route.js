import express from "express";
import { AddUser, Delete, DeleteAll, GetAllUsers, GetUser, Update } from "../controllers/users.controller.js";
const router = express.Router();

router.post("/",AddUser);
router.put("/:id",Update);
router.get('/',GetAllUsers);
router.get('/:id',GetUser);
router.delete("/:id",Delete);
router.delete('/',DeleteAll)

export default router;