import { WatchlistItem } from '../models/WatchlistItem.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const listWatchlist = catchAsync(async (req, res) => {
  const items = await WatchlistItem.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ items });
});

export const addToWatchlist = catchAsync(async (req, res) => {
  const item = await WatchlistItem.findOneAndUpdate(
    {
      'anime.externalId': req.body.anime.externalId,
      'anime.source': req.body.anime.source,
      user: req.user._id
    },
    {
      $set: {
        anime: req.body.anime,
        progress: req.body.progress || 0,
        status: req.body.status || 'planned'
      }
    },
    { new: true, runValidators: true, upsert: true }
  );

  res.status(201).json({ item });
});

export const updateWatchlistItem = catchAsync(async (req, res) => {
  const item = await WatchlistItem.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      ...(req.body.progress !== undefined ? { progress: req.body.progress } : {}),
      ...(req.body.status ? { status: req.body.status } : {})
    },
    { new: true, runValidators: true }
  );

  if (!item) {
    throw new AppError('Watchlist item not found', 404);
  }

  res.json({ item });
});

export const removeWatchlistItem = catchAsync(async (req, res) => {
  const item = await WatchlistItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!item) {
    throw new AppError('Watchlist item not found', 404);
  }

  res.status(204).send();
});
