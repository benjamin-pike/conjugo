import express from 'express';
import { progress, lesson, results } from '../controllers/learn.controllers'

const router = express.Router();

router.get('/progress/:language', progress)
router.post('/lesson/:language', lesson);
router.post('/results/:language', results);

export default router;