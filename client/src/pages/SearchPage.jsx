import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Chip, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchAnime } from '../api/anime.js';
import AnimeCard from '../components/AnimeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { useWatchlistActions } from '../hooks/useWatchlistActions.js';

const genreOptions = [
  { id: '', label: 'Any genre' },
  { id: '1', label: 'Action' },
  { id: '2', label: 'Adventure' },
  { id: '4', label: 'Comedy' },
  { id: '8', label: 'Drama' },
  { id: '10', label: 'Fantasy' },
  { id: '14', label: 'Horror' },
  { id: '22', label: 'Romance' },
  { id: '24', label: 'Sci-Fi' },
  { id: '36', label: 'Slice of Life' }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const sentinelRef = useRef(null);
  const debouncedQuery = useDebouncedValue(query);
  const { saveAnime, savedIds } = useWatchlistActions();

  const filters = useMemo(
    () => ({ genre, q: debouncedQuery, rating, status, type, year }),
    [debouncedQuery, genre, rating, status, type, year]
  );

  const searchQuery = useInfiniteQuery({
    enabled: Boolean(debouncedQuery.trim() || genre || year || rating || status || type),
    getNextPageParam: (lastPage) => (lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => searchAnime({ ...filters, page: pageParam }),
    queryKey: ['anime', 'search', filters]
  });

  const suggestionQuery = useQuery({
    enabled: query.trim().length >= 2,
    queryFn: () => searchAnime({ limit: 5, q: debouncedQuery }),
    queryKey: ['anime', 'suggestions', debouncedQuery]
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
        searchQuery.fetchNextPage();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [searchQuery]);

  const items = searchQuery.data?.pages.flatMap((page) => page.items) || [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h3">Anime Search</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Debounced search with filters, suggestions, and infinite scrolling.
        </Typography>
      </Box>

      <GlassCard sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Autocomplete
            freeSolo
            inputValue={query}
            loading={suggestionQuery.isFetching}
            onInputChange={(_event, value) => setQuery(value)}
            options={(suggestionQuery.data?.items || []).map((anime) => anime.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search anime"
                placeholder="Try Naruto, Frieren, Solo Leveling..."
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }
                }}
              />
            )}
          />
          <Grid2 container spacing={1.5}>
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField label="Genre" onChange={(event) => setGenre(event.target.value)} select value={genre}>
                {genreOptions.map((option) => <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>)}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField label="Year" onChange={(event) => setYear(event.target.value)} placeholder="2024" value={year} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField label="Min rating" onChange={(event) => setRating(event.target.value)} select value={rating}>
                <MenuItem value="">Any rating</MenuItem>
                {[6, 7, 8, 9].map((value) => <MenuItem key={value} value={value}>{value}+</MenuItem>)}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField label="Status" onChange={(event) => setStatus(event.target.value)} select value={status}>
                <MenuItem value="">Any status</MenuItem>
                <MenuItem value="airing">Airing</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField label="Format" onChange={(event) => setType(event.target.value)} select value={type}>
                <MenuItem value="">Any format</MenuItem>
                <MenuItem value="tv">TV</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip icon={<FilterAltIcon />} label={`${items.length} results loaded`} />
            {searchQuery.isFetching ? <Chip color="primary" label="Loading" /> : null}
          </Stack>
        </Stack>
      </GlassCard>

      {searchQuery.isError ? (
        <EmptyState message="Search is temporarily unavailable." title="Could not search anime" />
      ) : !searchQuery.isLoading && !items.length ? (
        <EmptyState message="Try another title, genre, or year." title="No anime found" />
      ) : (
        <Grid2 container spacing={2}>
          {items.map((anime) => (
            <Grid2 key={`${anime.source}-${anime.id}`} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <AnimeCard anime={anime} onSave={saveAnime} saved={savedIds.has(`${anime.source}-${anime.externalId}`)} />
            </Grid2>
          ))}
        </Grid2>
      )}
      <Box ref={sentinelRef} sx={{ height: 24 }} />
    </Stack>
  );
}
