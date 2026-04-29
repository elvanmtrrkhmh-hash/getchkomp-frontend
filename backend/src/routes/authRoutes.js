import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, validateUpdateProfile, updateProfile);

export default router;
