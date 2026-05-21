import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Chip, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link as RouterLink } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { useWatchlistActions } from '../hooks/useWatchlistActions.js';

export default function WatchlistPage() {
  const { removeMutation, updateMutation, watchlistQuery } = useWatchlistActions();
  const items = watchlistQuery.data || [];

  if (!watchlistQuery.isLoading && !items.length) {
    return (
      <EmptyState
        action={{ component: RouterLink, label: 'Find anime', to: '/search', variant: 'contained' }}
        message="Save anime from search or details pages and track your progress here."
        title="Your watchlist is empty"
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h3">Watchlist</Typography>
      <Grid2 container spacing={2}>
        {items.map((item) => (
          <Grid2 key={item._id} size={{ xs: 12, md: 6 }}>
            <GlassCard sx={{ p: 2 }}>
              <Stack direction="row" spacing={2}>
                <Box
                  component={RouterLink}
                  to={`/anime/${item.anime.externalId}`}
                  sx={{ flexShrink: 0, width: { xs: 96, sm: 126 } }}
                >
                  <Box
                    alt={item.anime.title}
                    component="img"
                    src={item.anime.posterUrl}
                    sx={{ aspectRatio: '2 / 3', borderRadius: 1, objectFit: 'cover', width: '100%' }}
                  />
                </Box>
                <Stack spacing={1.5} sx={{ minWidth: 0, width: '100%' }}>
                  <Typography component={RouterLink} fontWeight={900} to={`/anime/${item.anime.externalId}`} variant="h6">
                    {item.anime.title}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip icon={<RemoveRedEyeIcon />} label={item.status} size="small" />
                    <Chip label={`${item.progress || 0} watched`} size="small" />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      label="Status"
                      onChange={(event) => updateMutation.mutate({ id: item._id, payload: { status: event.target.value } })}
                      select
                      size="small"
                      value={item.status}
                    >
                      <MenuItem value="planned">Planned</MenuItem>
                      <MenuItem value="watching">Watching</MenuItem>
                      <MenuItem value="watched">Watched</MenuItem>
                    </TextField>
                    <TextField
                      inputProps={{ min: 0 }}
                      label="Progress"
                      onBlur={(event) => updateMutation.mutate({ id: item._id, payload: { progress: Number(event.target.value) } })}
                      size="small"
                      type="number"
                      defaultValue={item.progress || 0}
                    />
                    <IconButton aria-label="Remove from watchlist" onClick={() => removeMutation.mutate(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </GlassCard>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
