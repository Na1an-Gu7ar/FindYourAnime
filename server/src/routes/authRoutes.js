import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const emailRule = body('email').isEmail().normalizeEmail().withMessage('A valid email is required');
const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

router.post(
  '/register',
  authLimiter,
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 32 })
      .withMessage('Username must be 3 to 32 characters'),
    emailRule,
    passwordRule
  ],
  validate,
  authController.register
);

router.post('/login', authLimiter, [emailRule, passwordRule], validate, authController.login);
router.get('/me', authenticate, authController.me);
router.patch(
  '/me',
  authenticate,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 32 })
      .withMessage('Username must be 3 to 32 characters'),
    body('avatarUrl').optional().trim().isLength({ max: 500 }).withMessage('Avatar URL is too long')
  ],
  validate,
  authController.updateMe
);

export default router;
