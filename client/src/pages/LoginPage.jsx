import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (payload) => {
    await login(payload);
    navigate(location.state?.from?.pathname || '/profile', { replace: true });
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '72vh', placeItems: 'center' }}>
      <Stack alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <AuthForm mode="login" onSubmit={handleSubmit} />
        <Typography color="text.secondary">
          New here? <Link component={RouterLink} to="/register">Create an account</Link>
        </Typography>
      </Stack>
    </Box>
  );
}
