import express from 'express';
import { getPracticeConfig, updatePracticeConfig, generatePracticeSession, calculatePracticeResults } from '../controllers/practice.controllers';

const router = express.Router();

router.get('/configure/:language', getPracticeConfig);
router.put('/configure/:language', updatePracticeConfig);
router.get('/session', generatePracticeSession);
router.post('/results', calculatePracticeResults);

// module.exports = router;
export default router;