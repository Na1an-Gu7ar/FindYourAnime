import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassCard from './GlassCard.jsx';

export default function AuthForm({ mode, onSubmit }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard
      component={motion.form}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 460 }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1">
            {isRegister ? 'Create account' : 'Welcome back'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {isRegister ? 'Start building your anime universe.' : 'Continue your anime discovery journey.'}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {isRegister && (
          <TextField
            autoComplete="username"
            label="Username"
            name="username"
            onChange={handleChange}
            required
            value={form.username}
          />
        )}

        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />

        <TextField
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          label="Password"
          name="password"
          onChange={handleChange}
          required
          type="password"
          value={form.password}
        />

        <Button disabled={submitting} size="large" type="submit" variant="contained">
          {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
        </Button>
      </Stack>
    </GlassCard>
  );
}
