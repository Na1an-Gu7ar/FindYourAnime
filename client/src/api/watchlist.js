import api from './client.js';

export async function getWatchlist() {
  const { data } = await api.get('/watchlist');
  return data.items;
}

export async function saveWatchlistItem(payload) {
  const { data } = await api.post('/watchlist', payload);
  return data.item;
}

export async function updateWatchlistItem(id, payload) {
  const { data } = await api.patch(`/watchlist/${id}`, payload);
  return data.item;
}

export async function removeWatchlistItem(id) {
  await api.delete(`/watchlist/${id}`);
}
