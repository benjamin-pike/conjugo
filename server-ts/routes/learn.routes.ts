import express from 'express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/lesson', async (req: Request, res: Response) => {
    res.send('lesson');
});

router.post('/results', async (req: Request, res: Response) => {
    res.send('lesson');
});

export default router;