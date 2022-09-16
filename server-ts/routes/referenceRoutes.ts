import express from 'express';
import { Request, Response, NextFunction } from 'express';
import {
    getConjugations,
    getStarred, 
    updateStarred 
} from '../controllers/referenceControllers';

const router = express.Router();

router.get('/conjugations/:language/:verb', getConjugations);

router.get('/starred/:language', getStarred);
router.put('/starred/:language/:verb', updateStarred);
router.delete('/starred/:language/:verb', updateStarred);

module.exports = router;