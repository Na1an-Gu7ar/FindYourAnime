import { Router } from 'express';
import { body, param } from 'express-validator';
import * as watchlistController from '../controllers/watchlistController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/', watchlistController.listWatchlist);
router.post(
  '/',
  [
    body('anime.externalId').notEmpty().withMessage('Anime externalId is required'),
    body('anime.source').isIn(['jikan', 'anilist', 'manual']).withMessage('Anime source is invalid'),
    body('anime.title').trim().notEmpty().withMessage('Anime title is required'),
    body('progress').optional().isInt({ min: 0 }).withMessage('Progress must be zero or greater'),
    body('status').optional().isIn(['planned', 'watching', 'watched'])
  ],
  validate,
  watchlistController.addToWatchlist
);
router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('A valid watchlist id is required'),
    body('progress').optional().isInt({ min: 0 }).withMessage('Progress must be zero or greater'),
    body('status').optional().isIn(['planned', 'watching', 'watched']).withMessage('Watch status is invalid')
  ],
  validate,
  watchlistController.updateWatchlistItem
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('A valid watchlist id is required')],
  validate,
  watchlistController.removeWatchlistItem
);

export default router;
