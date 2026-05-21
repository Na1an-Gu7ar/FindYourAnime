import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { getSeasonalAnime, getTopAnime, getTrendingAnime } from '../api/anime.js';
import AnimeSection from '../components/AnimeSection.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { useWatchlistActions } from '../hooks/useWatchlistActions.js';

export default function HomePage() {
  const { saveAnime, savedIds } = useWatchlistActions();
  const [trending, top, seasonal] = useQueries({
    queries: [
      { queryFn: getTrendingAnime, queryKey: ['anime', 'trending'] },
      { queryFn: getTopAnime, queryKey: ['anime', 'top'] },
      { queryFn: getSeasonalAnime, queryKey: ['anime', 'seasonal'] }
    ]
  });
  const heroAnime = trending.data?.[0];
  const popularThisWeek = [...(trending.data || []), ...(seasonal.data || [])].slice(3, 15);

  return (
    <Stack spacing={6}>
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          backgroundImage: heroAnime
            ? `linear-gradient(90deg, rgba(7,9,20,0.98), rgba(7,9,20,0.58)), url(${heroAnime.bannerUrl || heroAnime.posterUrl})`
            : 'linear-gradient(120deg, rgba(0,229,255,0.14), rgba(233,69,96,0.14))',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 2,
          minHeight: { xs: 520, md: 620 },
          overflow: 'hidden',
          p: { xs: 2, sm: 3, md: 5 }
        }}
      >
        <Grid2 alignItems="end" container spacing={4} sx={{ minHeight: 'inherit' }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              <Chip color="secondary" label="Anime discovery, legally sourced" sx={{ alignSelf: 'flex-start' }} />
              <Typography component="h1" variant="h2">
                FindYourAnime
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 720 }} variant="h6">
                Discover trending series, compare language availability, save your watchlist, and jump to legal streaming platforms.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} size="large" startIcon={<SearchIcon />} to="/search" variant="contained">
                  Search anime
                </Button>
                {heroAnime ? (
                  <Button component={RouterLink} size="large" to={`/anime/${heroAnime.id}`} variant="outlined">
                    Featured details
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <GlassCard sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Popular Now</Typography>
                {(trending.data || []).slice(0, 4).map((anime, index) => (
                  <Stack
                    alignItems="center"
                    component={RouterLink}
                    direction="row"
                    key={anime.id}
                    spacing={2}
                    to={`/anime/${anime.id}`}
                  >
                    <Typography color="primary" fontWeight={900}>0{index + 1}</Typography>
                    <Box component="img" src={anime.posterUrl} sx={{ borderRadius: 1, height: 72, objectFit: 'cover', width: 52 }} />
                    <Box>
                      <Typography fontWeight={900}>{anime.title}</Typography>
                      <Typography color="text.secondary" variant="body2">{anime.rating || 'N/A'} score</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </GlassCard>
          </Grid2>
        </Grid2>
      </Box>

      <AnimeSection error={trending.isError} items={trending.data} loading={trending.isLoading} onSave={saveAnime} savedIds={savedIds} title="Trending Anime" />
      <AnimeSection error={top.isError} items={top.data} loading={top.isLoading} onSave={saveAnime} savedIds={savedIds} title="Top Rated Anime" />
      <AnimeSection error={seasonal.isError} items={seasonal.data} loading={seasonal.isLoading} onSave={saveAnime} savedIds={savedIds} title="Seasonal Anime" />
      <AnimeSection items={popularThisWeek} loading={trending.isLoading || seasonal.isLoading} onSave={saveAnime} savedIds={savedIds} title="Popular This Week" />
    </Stack>
  );
}
