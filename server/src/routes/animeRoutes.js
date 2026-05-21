import { Router } from 'express';
import { param, query } from 'express-validator';
import * as animeController from '../controllers/animeController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/trending', animeController.trending);
router.get('/top', animeController.top);
router.get('/seasonal', animeController.seasonal);
router.get(
  '/search',
  [
    query('q')
      .optional()
      .if((value) => value !== '')
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query is too long'),
    query('page')
      .optional()
      .if((value) => value !== '')
      .isInt({ min: 1 })
      .withMessage('Page must be a positive number'),
    query('limit')
      .optional()
      .if((value) => value !== '')
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('year')
      .optional()
      .if((value) => value !== '')
      .isInt({ min: 1917, max: 2100 })
      .withMessage('Year is invalid'),
    query('rating')
      .optional()
      .if((value) => value !== '')
      .isFloat({ min: 0, max: 10 })
      .withMessage('Rating must be between 0 and 10'),
    query('genre').optional().if((value) => value !== '').trim(),
    query('status').optional().if((value) => value !== '').trim(),
    query('type').optional().if((value) => value !== '').trim()
  ],
  validate,
  animeController.search
);
router.get('/:id', [param('id').isInt({ min: 1 }).withMessage('Anime id is invalid')], validate, animeController.details);
router.get(
  '/:id/recommendations',
  [param('id').isInt({ min: 1 }).withMessage('Anime id is invalid')],
  validate,
  animeController.recommendations
);

export default router;
