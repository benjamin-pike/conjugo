import express from 'express';
import { getConjugations, getSavedVerbs,  updatedSavedVerbs } from '../controllers/reference.controllers';

const router = express.Router();

router.get('/conjugations/:language/:verb', getConjugations);

router.get('/saved/:language', getSavedVerbs);
router.put('/saved/:language/:verb', updatedSavedVerbs);
router.delete('/saved/:language/:verb', updatedSavedVerbs);

export default router;