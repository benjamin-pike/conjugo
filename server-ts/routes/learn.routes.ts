import express from 'express';
import { lesson } from '../controllers/learn.controllers'

const router = express.Router();

router.get('/lesson/:language/:complexity/:mood/:tense', lesson);

export default router;