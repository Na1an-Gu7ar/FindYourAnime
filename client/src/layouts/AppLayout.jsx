import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useColorMode } from '../theme/ColorModeContext.jsx';

export default function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleMode } = useColorMode();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky"
        sx={{ backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Toolbar component={Container} maxWidth="xl" sx={{ gap: 2 }}>
          <IconButton aria-label="Open navigation" sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 900 }}
          >
            FindYourAnime
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button component={RouterLink} startIcon={<SearchIcon />} to="/search">
              Search
            </Button>
            {isAuthenticated && (
              <Button component={RouterLink} startIcon={<BookmarkIcon />} to="/watchlist">
                Watchlist
              </Button>
            )}
            {isAuthenticated && <Button component={RouterLink} to="/profile">{user?.username || 'Profile'}</Button>}
          </Stack>
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton aria-label="Toggle color mode" onClick={toggleMode}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          {isAuthenticated ? (
            <Tooltip title="Logout">
              <IconButton aria-label="Logout" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button component={RouterLink} to="/login" variant="contained">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
