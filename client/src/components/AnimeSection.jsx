import { Box, Skeleton, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import AnimeCard from './AnimeCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function AnimeSection({ error, items = [], loading, onSave, savedIds = new Set(), title }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">{title}</Typography>
      {error ? (
        <EmptyState message="The anime provider did not respond. Try refreshing in a moment." title="Could not load anime" />
      ) : (
        <Grid2 container spacing={2}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                  <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" width="100%">
                    <Box sx={{ aspectRatio: '2 / 3' }} />
                  </Skeleton>
                </Grid2>
              ))
            : items.map((anime) => (
                <Grid2 key={`${anime.source}-${anime.id}`} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                  <AnimeCard anime={anime} onSave={onSave} saved={savedIds.has(`${anime.source}-${anime.externalId}`)} />
                </Grid2>
              ))}
        </Grid2>
      )}
    </Stack>
  );
}
