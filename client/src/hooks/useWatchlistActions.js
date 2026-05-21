import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeWatchlistItem, saveWatchlistItem, updateWatchlistItem } from '../api/watchlist.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { savedKey, toWatchlistPayload } from '../utils/animePayload.js';

export function useWatchlistActions() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const watchlistQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: getWatchlist,
    queryKey: ['watchlist']
  });

  const saveMutation = useMutation({
    mutationFn: (anime) => saveWatchlistItem(toWatchlistPayload(anime)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      showToast('Saved to your watchlist');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateWatchlistItem(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['watchlist'] });
      const previous = queryClient.getQueryData(['watchlist']);
      queryClient.setQueryData(['watchlist'], (items = []) =>
        items.map((item) => (item._id === id ? { ...item, ...payload } : item))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['watchlist'], context?.previous);
      showToast('Could not update watchlist item', 'error');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const removeMutation = useMutation({
    mutationFn: removeWatchlistItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['watchlist'] });
      const previous = queryClient.getQueryData(['watchlist']);
      queryClient.setQueryData(['watchlist'], (items = []) => items.filter((item) => item._id !== id));
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(['watchlist'], context?.previous);
      showToast('Could not remove watchlist item', 'error');
    },
    onSuccess: () => showToast('Removed from watchlist'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const savedIds = new Set((watchlistQuery.data || []).map((item) => `${item.anime.source}-${item.anime.externalId}`));

  const saveAnime = (anime) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (savedIds.has(savedKey(anime))) {
      showToast('Already in your watchlist');
      return;
    }
    saveMutation.mutate(anime);
  };

  return {
    removeMutation,
    saveAnime,
    saveMutation,
    savedIds,
    updateMutation,
    watchlistQuery
  };
}
