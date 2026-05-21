import api from './client.js';

export async function getTrendingAnime() {
  const { data } = await api.get('/anime/trending');
  return data.items;
}

export async function getTopAnime() {
  const { data } = await api.get('/anime/top');
  return data.items;
}

export async function getSeasonalAnime() {
  const { data } = await api.get('/anime/seasonal');
  return data.items;
}

export async function searchAnime(params) {
  // Filter out empty string values before sending
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );
  const { data } = await api.get('/anime/search', { params: cleanParams });
  return data;
}

export async function getAnimeDetails(id) {
  const { data } = await api.get(`/anime/${id}`);
  return data.anime;
}

export async function getAnimeRecommendations(id) {
  const { data } = await api.get(`/anime/${id}/recommendations`);
  return data.items;
}
