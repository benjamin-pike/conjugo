import express from 'express';

import { login, register, token } from '../controllers/auth.controllers';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/token', token);

export default router;