import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LinearProgress } from '@mui/material';
import AppLayout from './layouts/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const AnimeDetailsPage = lazy(() => import('./pages/AnimeDetailsPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="anime/:id" element={<AnimeDetailsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
