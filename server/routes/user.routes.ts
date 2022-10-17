import express from "express";
import { getUser, getLanguages } from "../controllers/user.controllers";

const router = express.Router();

router.get('/', getUser)
router.get('/languages', getLanguages)

export default router;