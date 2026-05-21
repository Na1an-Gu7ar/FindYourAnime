import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeDetails, getAnimeRecommendations } from '../api/anime.js';
import AnimeSection from '../components/AnimeSection.jsx';
import AppModal from '../components/AppModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import GlassCard from '../components/GlassCard.jsx';
import LanguageBadges from '../components/LanguageBadges.jsx';
import StreamingPlatforms from '../components/StreamingPlatforms.jsx';
import { useWatchlistActions } from '../hooks/useWatchlistActions.js';

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { saveAnime, savedIds } = useWatchlistActions();
  const detailQuery = useQuery({ queryFn: () => getAnimeDetails(id), queryKey: ['anime', id] });
  const recommendationQuery = useQuery({
    enabled: Boolean(id),
    queryFn: () => getAnimeRecommendations(id),
    queryKey: ['anime', id, 'recommendations']
  });

  if (detailQuery.isLoading) {
    return <Skeleton sx={{ borderRadius: 2, minHeight: 520 }} variant="rectangular" />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <EmptyState message="The details page could not be loaded right now." title="Anime not found" />;
  }

  const anime = detailQuery.data;
  const isSaved = savedIds.has(`${anime.source}-${anime.externalId}`);

  return (
    <Stack spacing={5}>
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 20, backgroundSize: "110% 110%" }}
        animate={{ opacity: 1, y: 0, backgroundSize: "100% 100%" }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 0.5 },
          backgroundSize: {
            duration: 10,
            ease: "linear",
          }
        }}
        sx={{
          backgroundImage: `linear-gradient(90deg, rgba(7,9,20,0.96), rgba(7,9,20,0.62)), url(${anime.bannerUrl || anime.posterUrl})`,
          backgroundPosition: 'center',
          // backgroundSize: 'cover',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          p: { xs: 2, md: 4 }
        }}
      >
        <Grid2 alignItems="end" container spacing={3}>
          <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
            <Box
              alt={anime.title}
              component="img"
              src={anime.posterUrl}
              sx={{ borderRadius: 2, boxShadow: '0 24px 70px rgba(0,0,0,0.45)', width: '100%' }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
            <Stack spacing={2}>
              <Typography component="h1" variant="h3">{anime.title}</Typography>
              <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1.2}>
                <Chip color="primary" icon={<StarIcon />} label={`${anime.score || 'N/A'} score`} />
                <Chip label={`${anime.episodes || 'Unknown'} episodes`} />
                <Chip label={anime.status || 'Status unknown'} />
                <Chip label={anime.releaseYear || anime.year || 'Year unknown'} />
              </Stack>
              <Typography color="text.secondary" sx={{ maxWidth: 900 }}>{anime.synopsis}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  color={isSaved ? 'secondary' : 'primary'}
                  onClick={() => saveAnime(anime)}
                  startIcon={<BookmarkAddIcon />}
                  variant="contained"
                >
                  {isSaved ? 'Saved' : 'Save anime'}
                </Button>
                {anime.trailer?.embedUrl ? (
                  <Button onClick={() => setTrailerOpen(true)} startIcon={<PlayArrowIcon />} variant="outlined">
                    Watch trailer
                  </Button>
                ) : anime.trailer?.searchUrl ? (
                  <Button
                    component="a"
                    href={anime.trailer.searchUrl}
                    rel="noopener noreferrer"
                    startIcon={<PlayArrowIcon />}
                    target="_blank"
                    variant="outlined"
                  >
                    Search trailer on YouTube
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Grid2>
        </Grid2>
      </Box>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <GlassCard sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Languages</Typography>
                <LanguageBadges languages={anime.languages} />
              </Stack>
            </GlassCard>
            <GlassCard sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Streaming availability</Typography>
                <StreamingPlatforms platforms={anime.streamingPlatforms} />
              </Stack>
            </GlassCard>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 5 }}>
          <GlassCard sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Details</Typography>
              <Typography color="text.secondary">Studios: {anime.studios?.join(', ') || 'Unknown'}</Typography>
              <Typography color="text.secondary">Genres: {anime.genres?.join(', ') || 'Unknown'}</Typography>
              <Typography color="text.secondary">Type: {anime.type || 'Unknown'}</Typography>
            </Stack>
          </GlassCard>
        </Grid2>
      </Grid2>

      {anime.characters?.length ? (
        <Stack spacing={2}>
          <Typography variant="h4">Characters</Typography>
          <Grid2 container spacing={2}>
            {anime.characters.map((character) => (
              <Grid2 key={character.id || character.name} size={{ xs: 6, sm: 4, md: 2 }}>
                <GlassCard sx={{ p: 1.5 }}>
                  <Box component="img" src={character.imageUrl} sx={{ aspectRatio: '1', borderRadius: 1, objectFit: 'cover', width: '100%' }} />
                  <Typography fontWeight={800} sx={{ mt: 1 }}>{character.name}</Typography>
                  <Typography color="text.secondary" variant="body2">{character.role}</Typography>
                </GlassCard>
              </Grid2>
            ))}
          </Grid2>
        </Stack>
      ) : null}

      <AnimeSection
        error={recommendationQuery.isError}
        items={recommendationQuery.data}
        loading={recommendationQuery.isLoading}
        onSave={saveAnime}
        savedIds={savedIds}
        title="You May Also Like"
      />

      <AppModal onClose={() => setTrailerOpen(false)} open={trailerOpen} title={`${anime.title} trailer`}>
        <Box sx={{ aspectRatio: '16 / 9' }}>
          <Box
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            component="iframe"
            src={anime.trailer?.embedUrl}
            sx={{ border: 0, borderRadius: 2, height: '100%', width: '100%' }}
            title={`${anime.title} trailer`}
          />
        </Box>
      </AppModal>
    </Stack>
  );
}
