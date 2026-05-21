# Find Your Anime

A modern full-stack anime discovery platform built with React, Vite, Material UI, Node.js, Express, MongoDB, and JWT authentication.

The platform now includes authentication, anime discovery, legal streaming availability, recommendations, watchlist tracking, and profile editing placeholders on a scalable React and Express architecture.

## Tech Stack

- Frontend: React, Vite, MUI, React Router, Axios, TanStack Query, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Anime APIs: Jikan REST API and AniList GraphQL API

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Update `server/.env` with your MongoDB Atlas URI and JWT secret.

4. Run both apps:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Authentication

Implemented:

- Register and login pages
- JWT issuing and verification
- Password hashing with bcrypt
- Persistent frontend sessions through local storage
- Protected `/profile` and `/watchlist` routes
- Protected `/api/auth/me` and `/api/watchlist` API routes
- Secure middleware with Helmet, CORS, rate limiting, and validation

## Anime Discovery

Backend APIs:

- `GET /api/anime/trending`
- `GET /api/anime/top`
- `GET /api/anime/seasonal`
- `GET /api/anime/search?q=&page=&genre=&year=&rating=&status=&type=`
- `GET /api/anime/:id`
- `GET /api/anime/:id/recommendations`

Discovery data is normalized through a service layer with reusable API utilities, in-memory caching, provider error handling, Jikan REST integration, and AniList GraphQL recommendation fallback.

Frontend features:

- Responsive home, search, details, watchlist, and profile pages
- Hero banner, trending, top rated, seasonal, and popular sections
- Debounced search, suggestions, filters, and infinite scrolling
- Anime details with trailer modal, characters, languages, legal platform cards, and recommendations
- Optimistic watchlist save/remove/status/progress updates
- Lazy-loaded route chunks and image lazy loading

## Deployment Notes

### Frontend: Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-api.onrender.com/api`

### Backend: Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL`
  - `NODE_ENV=production`
  - `PORT`

No API keys are required for Jikan or AniList. Keep outbound HTTPS enabled on your backend host.

### Database: MongoDB Atlas

- Create a cluster.
- Add a database user.
- Allow Render outbound access or configure an IP allowlist.
- Paste the connection string into `MONGODB_URI`.

## Architecture Notes

The server is split into controllers, routes, middleware, services, models, config, and utilities. The client is split into API clients, auth and toast context, reusable components, layouts, routes, pages, theme, hooks, and utilities. Mock language and streaming availability are intentionally structured as provider-like objects so real integrations can replace them later without reshaping the UI.
