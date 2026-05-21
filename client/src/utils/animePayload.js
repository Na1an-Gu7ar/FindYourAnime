export function toWatchlistPayload(anime, overrides = {}) {
  return {
    anime: {
      bannerUrl: anime.bannerUrl,
      episodes: anime.episodes,
      externalId: anime.externalId || anime.id,
      posterUrl: anime.posterUrl,
      rating: anime.rating || anime.score,
      source: anime.source || 'jikan',
      title: anime.title,
      year: anime.year || anime.releaseYear
    },
    status: 'planned',
    ...overrides
  };
}

export function savedKey(anime) {
  return `${anime.source || 'jikan'}-${anime.externalId || anime.id}`;
}
