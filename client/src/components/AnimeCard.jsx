import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import StarIcon from '@mui/icons-material/Star';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import GlassCard from './GlassCard.jsx';

export default function AnimeCard({ anime, onSave, saved }) {
  return (
    <GlassCard
      component={motion.article}
      whileHover={{ y: -8 }}
      sx={{
        height: '100%',
        overflow: 'hidden',
        transition: 'border-color 180ms ease',
        '&:hover': { borderColor: 'primary.main' }
      }}
    >
      <Box
        component={RouterLink}
        to={`/anime/${anime.id}`}
        sx={{ display: 'block', height: '100%' }}
      >
        <Box
          alt={anime.title}
          component="img"
          loading="lazy"
          src={anime.posterUrl || anime.bannerUrl}
          sx={{ aspectRatio: '2 / 3', display: 'block', objectFit: 'cover', width: '100%' }}
        />
        <Stack spacing={1.2} sx={{ p: 2 }}>
          <Stack alignItems="flex-start" direction="row" spacing={1}>
            <Typography
              component={RouterLink}
              fontWeight={900}
              lineHeight={1.2}
              sx={{ flexGrow: 1 }}
              to={`/anime/${anime.id}`}
            >
              {anime.title}
            </Typography>
            {onSave ? (
              <Tooltip title={saved ? 'Saved' : 'Save'}>
                <IconButton
                  aria-label={saved ? 'Saved to watchlist' : 'Save to watchlist'}
                  color={saved ? 'primary' : 'default'}
                  onClick={(event) => {
                    event.preventDefault();
                    onSave(anime);
                  }}
                  size="small"
                >
                  <BookmarkAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <StarIcon color="primary" fontSize="small" />
            <Typography color="text.secondary" variant="body2">
              {anime.rating || anime.score || 'N/A'} {anime.episodes ? `• ${anime.episodes} eps` : ''}
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {(anime.genres || []).slice(0, 3).map((genre) => (
              <Chip key={genre} label={genre} size="small" />
            ))}
          </Stack>
        </Stack>
      </Box>
    </GlassCard>
  );
}
