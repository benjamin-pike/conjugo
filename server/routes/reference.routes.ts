import express from 'express';
import { getConjugations, getSavedVerbs,  updateSavedVerbs } from '../controllers/reference.controllers';

const router = express.Router();

router.get('/data/:language/:verb', getConjugations);

router.get('/saved/:language', getSavedVerbs);
router.put('/saved/:language/:verb', updateSavedVerbs);
router.delete('/saved/:language/:verb', updateSavedVerbs);

export default router;