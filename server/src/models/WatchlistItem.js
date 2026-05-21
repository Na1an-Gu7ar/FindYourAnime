import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema(
  {
    anime: {
      bannerUrl: String,
      externalId: { required: true, type: String },
      posterUrl: String,
      rating: Number,
      source: { enum: ['jikan', 'anilist', 'manual'], required: true, type: String },
      title: { required: true, trim: true, type: String },
      year: Number
    },
    progress: {
      default: 0,
      min: 0,
      type: Number
    },
    status: {
      default: 'planned',
      enum: ['planned', 'watching', 'watched'],
      type: String
    },
    user: {
      ref: 'User',
      required: true,
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

watchlistItemSchema.index({ user: 1, 'anime.externalId': 1, 'anime.source': 1 }, { unique: true });

export const WatchlistItem = mongoose.model('WatchlistItem', watchlistItemSchema);
