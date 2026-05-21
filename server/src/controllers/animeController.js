import * as animeService from '../services/animeService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const trending = catchAsync(async (_req, res) => {
  const items = await animeService.getTrendingAnime();
  res.json({ items });
});

export const top = catchAsync(async (_req, res) => {
  const items = await animeService.getTopAnime();
  res.json({ items });
});

export const seasonal = catchAsync(async (_req, res) => {
  const items = await animeService.getSeasonalAnime();
  res.json({ items });
});

export const search = catchAsync(async (req, res) => {
  const result = await animeService.searchAnime(req.query);
  res.json(result);
});

export const details = catchAsync(async (req, res) => {
  const anime = await animeService.getAnimeDetails(req.params.id);
  res.json({ anime });
});

export const recommendations = catchAsync(async (req, res) => {
  const items = await animeService.getRecommendations(req.params.id);
  res.json({ items });
});
