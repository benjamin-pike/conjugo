import express from 'express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/conjugations', async (req: Request, res: Response) => {
    res.send('Conjugations');
});

router.get('/starred', async (req: Request, res: Response) => {
    res.send('Starred');
});

router.put('/starred', async (req: Request, res: Response) => {
    res.send('Starred');
});

module.exports = router;