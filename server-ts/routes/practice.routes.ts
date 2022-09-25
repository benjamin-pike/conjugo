import express from 'express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/configure', async (req: Request, res: Response) => {
    res.send('Configure');
});

router.put('/configure', async (req: Request, res: Response) => {
    res.send('Configure');
});

router.get('/conjugations', async (req: Request, res: Response) => {
    res.send('Conjugations');
});

router.post('/results', async (req: Request, res: Response) => {
    res.send('Results');
});

module.exports = router;