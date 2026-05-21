import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await register(payload);
    navigate('/profile', { replace: true });
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '72vh', placeItems: 'center' }}>
      <Stack alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <AuthForm mode="register" onSubmit={handleSubmit} />
        <Typography color="text.secondary">
          Already have an account? <Link component={RouterLink} to="/login">Login</Link>
        </Typography>
      </Stack>
    </Box>
  );
}
