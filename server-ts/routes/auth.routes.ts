import express from 'express';
import { login, logout, register, token } from '../controllers/auth.controllers';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout)
router.post('/register', register);
router.post('/token', token);

export default router;