import express from "express";
import { getUser } from "../controllers/user.controllers";

const router = express.Router();

router.get('/', getUser)

export default router;