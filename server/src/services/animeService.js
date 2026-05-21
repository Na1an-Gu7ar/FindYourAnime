import { getJson, postJson } from '../utils/apiClient.js';
import { remember } from '../utils/cache.js';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const ANILIST_URL = 'https://graphql.anilist.co';
const CACHE_TTL = 1000 * 60 * 15;

const platformCatalog = [
  { key: 'crunchyroll', name: 'Crunchyroll', logo: 'CR', languages: ['Japanese Sub', 'English Dub', 'Hindi Dub'], url: 'https://www.crunchyroll.com/search?q=' },
  { key: 'netflix', name: 'Netflix', logo: 'NX', languages: ['Japanese Sub', 'English Dub'], url: 'https://www.netflix.com/search?q=' },
  { key: 'prime', name: 'Prime Video', logo: 'PV', languages: ['Japanese Sub', 'English Dub'], url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=' },
  { key: 'muse', name: 'Muse Asia', logo: 'MA', languages: ['Japanese Sub'], url: 'https://www.youtube.com/@MuseAsia/search?query=' },
  { key: 'anione', name: 'Ani-One Asia', logo: 'AO', languages: ['Japanese Sub'], url: 'https://www.youtube.com/@AniOneAsia/search?query=' },
  { key: 'hianime', name: 'HiAnime', logo: 'Hi', languages: ['Japanese Sub'], url: 'https://hianimetv.ru/search?query=' }
];

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, '').trim();
}

function normalizeJikanAnime(item) {
  const title = item.title_english || item.title || item.title_japanese || 'Untitled anime';
  const trailerId = item.trailer?.youtube_id;

  // Fallback YouTube search URL if trailer not found
  const trailerData = trailerId
    ? {
        embedUrl: `https://www.youtube.com/embed/${trailerId}`,
        imageUrl: item.trailer?.images?.maximum_image_url,
        url: item.trailer?.url
      }
    : {
        searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} trailer`)}`
      };

  return {
    airing: item.airing,
    bannerUrl: item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url,
    characters: [],
    duration: item.duration,
    episodes: item.episodes,
    externalId: String(item.mal_id),
    genres: item.genres?.map((genre) => genre.name) || [],
    id: String(item.mal_id),
    languages: getLanguageAvailability(item),
    popularity: item.popularity,
    posterUrl: item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url,
    rating: item.score,
    releaseYear: item.year || item.aired?.prop?.from?.year,
    score: item.score,
    source: 'jikan',
    status: item.status,
    streamingPlatforms: getStreamingPlatforms(title),
    studios: item.studios?.map((studio) => studio.name) || [],
    synopsis: stripHtml(item.synopsis || item.background || ''),
    title,
    titleJapanese: item.title_japanese,
    trailer: trailerData,
    type: item.type,
    year: item.year || item.aired?.prop?.from?.year
  };
}

function normalizeAniListAnime(item) {
  const title = item.title?.english || item.title?.romaji || item.title?.native || 'Untitled anime';

  // Fallback YouTube search URL if trailer not found
  const trailerData = item.trailer?.site === 'youtube'
    ? { embedUrl: `https://www.youtube.com/embed/${item.trailer.id}`, url: `https://youtu.be/${item.trailer.id}` }
    : {
        searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} trailer`)}`
      };

  return {
    bannerUrl: item.bannerImage || item.coverImage?.extraLarge,
    episodes: item.episodes,
    externalId: String(item.id),
    genres: item.genres || [],
    id: String(item.idMal || item.id),
    languages: getLanguageAvailability(item),
    popularity: item.popularity,
    posterUrl: item.coverImage?.extraLarge || item.coverImage?.large,
    rating: item.averageScore ? Math.round(item.averageScore / 10) : null,
    releaseYear: item.seasonYear,
    score: item.averageScore ? Math.round(item.averageScore / 10) : null,
    source: 'anilist',
    status: item.status,
    streamingPlatforms: getStreamingPlatforms(title),
    studios: item.studios?.nodes?.map((studio) => studio.name) || [],
    synopsis: stripHtml(item.description || ''),
    title,
    titleJapanese: item.title?.native,
    trailer: trailerData,
    type: item.format,
    year: item.seasonYear
  };
}

function getLanguageAvailability(item) {
  const score = item.score || item.averageScore || 0;
  const popularity = item.popularity || item.members || 0;

  return [
    { available: true, code: 'ja-sub', label: 'Japanese Sub' },
    { available: score >= 7 || popularity > 10000, code: 'en-dub', label: 'English Dub' },
    { available: popularity > 50000 || score >= 8, code: 'hi-dub', label: 'Hindi Dub' }
  ];
}

function getStreamingPlatforms(title) {
  const encodedTitle = encodeURIComponent(title);
  return platformCatalog.map((platform, index) => ({
    ...platform,
    languages: platform.languages.map((label) => ({ label, available: index < 2 || label !== 'Hindi Dub' })),
    watchUrl: `${platform.url}${encodedTitle}`
  }));
}

async function fetchJikan(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return getJson(`${JIKAN_BASE_URL}${path}${suffix}`);
}

async function fetchAniList(query, variables = {}) {
  return postJson(ANILIST_URL, { query, variables });
}

function paginatedResponse(response) {
  return {
    items: response.data.map(normalizeJikanAnime),
    pagination: {
      currentPage: response.pagination?.current_page || 1,
      hasNextPage: Boolean(response.pagination?.has_next_page),
      lastVisiblePage: response.pagination?.last_visible_page
    }
  };
}

export function getTrendingAnime() {
  return remember('anime:trending', async () => {
    const response = await fetchJikan('/top/anime', { filter: 'bypopularity', limit: 12 });
    return paginatedResponse(response).items;
  }, CACHE_TTL);
}

export function getTopAnime() {
  return remember('anime:top', async () => {
    const response = await fetchJikan('/top/anime', { filter: 'favorite', limit: 12 });
    return paginatedResponse(response).items;
  }, CACHE_TTL);
}

export function getSeasonalAnime() {
  return remember('anime:seasonal', async () => {
    const response = await fetchJikan('/seasons/now', { limit: 12 });
    return paginatedResponse(response).items;
  }, CACHE_TTL);
}

export async function searchAnime(filters) {
  // Filter out empty string values before creating cache key
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );
  
  const cacheKey = `anime:search:${JSON.stringify(cleanFilters)}`;
  return remember(cacheKey, async () => {
    const response = await fetchJikan('/anime', {
      genres: cleanFilters.genre,
      limit: cleanFilters.limit || 20,
      min_score: cleanFilters.rating,
      order_by: cleanFilters.q ? undefined : 'popularity',
      page: cleanFilters.page || 1,
      q: cleanFilters.q,
      sort: cleanFilters.q ? undefined : 'asc',
      status: cleanFilters.status,
      type: cleanFilters.type,
      start_date: cleanFilters.year ? `${cleanFilters.year}-01-01` : undefined,
      end_date: cleanFilters.year ? `${cleanFilters.year}-12-31` : undefined
    });
    return paginatedResponse(response);
  }, CACHE_TTL);
}

export async function getAnimeDetails(id) {
  return remember(`anime:detail:${id}`, async () => {
    const [detailResponse, characterResponse] = await Promise.all([
      fetchJikan(`/anime/${id}/full`),
      fetchJikan(`/anime/${id}/characters`).catch(() => ({ data: [] }))
    ]);

    const anime = normalizeJikanAnime(detailResponse.data);
    anime.characters = characterResponse.data.slice(0, 12).map((entry) => ({
      id: entry.character?.mal_id,
      imageUrl: entry.character?.images?.webp?.image_url || entry.character?.images?.jpg?.image_url,
      name: entry.character?.name,
      role: entry.role
    }));

    return anime;
  }, CACHE_TTL);
}

export async function getRecommendations(id) {
  return remember(`anime:recommendations:${id}`, async () => {
    const anime = await getAnimeDetails(id);
    return getGenreRecommendations(anime.genres, anime.score);
  }, CACHE_TTL);
}

export async function getGenreRecommendations(genres = [], minScore = 7) {
  const query = `
    query Recommendations($genres: [String], $score: Int) {
      Page(page: 1, perPage: 12) {
        media(type: ANIME, genre_in: $genres, averageScore_greater: $score, sort: [POPULARITY_DESC, SCORE_DESC]) {
          id
          idMal
          title { romaji english native }
          coverImage { large extraLarge }
          bannerImage
          averageScore
          episodes
          genres
          popularity
          seasonYear
          status
          format
          description
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    }
  `;

  const response = await fetchAniList(query, {
    genres: genres.length ? genres.slice(0, 3) : undefined,
    score: Math.max(60, Math.round((minScore || 7) * 10) - 10)
  });

  return response.data.Page.media.map(normalizeAniListAnime);
}
