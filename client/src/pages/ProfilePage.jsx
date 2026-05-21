import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useMemo, useState } from 'react';
import AppModal from '../components/AppModal.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWatchlistActions } from '../hooks/useWatchlistActions.js';

export default function ProfilePage() {
  const { updateProfile, user } = useAuth();
  const { showToast } = useToast();
  const { watchlistQuery } = useWatchlistActions();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ avatarUrl: user?.avatarUrl || '', username: user?.username || '' });

  const stats = useMemo(() => {
    const items = watchlistQuery.data || [];
    return {
      saved: items.length,
      watched: items.filter((item) => item.status === 'watched').length
    };
  }, [watchlistQuery.data]);

  const joinedDate = user?.createdAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(user.createdAt)) : 'Recently';

  const handleSave = async () => {
    await updateProfile(form);
    showToast('Profile updated');
    setEditing(false);
  };

  return (
    <Stack spacing={4}>
      <GlassCard sx={{ p: { xs: 3, md: 4 } }}>
        <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Avatar src={user?.avatarUrl} sx={{ height: 104, width: 104 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4">{user?.username}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Joined {joinedDate}</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button startIcon={<PhotoCameraIcon />} variant="outlined">Avatar upload soon</Button>
            <Button onClick={() => setEditing(true)} startIcon={<EditIcon />} variant="contained">Edit profile</Button>
          </Stack>
        </Stack>
      </GlassCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 3 }}>
            <Typography variant="h5">Saved anime</Typography>
            <Typography color="primary" variant="h3">{stats.saved}</Typography>
          </GlassCard>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 3 }}>
            <Typography variant="h5">Watched anime</Typography>
            <Typography color="primary" variant="h3">{stats.watched}</Typography>
          </GlassCard>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 3 }}>
            <Typography variant="h5">Avatar upload</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Placeholder ready for future cloud storage integration.
            </Typography>
          </GlassCard>
        </Grid2>
      </Grid2>

      <AppModal onClose={() => setEditing(false)} open={editing} title="Edit profile">
        <Stack spacing={2}>
          <TextField label="Username" onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} value={form.username} />
          <TextField label="Avatar URL" onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} value={form.avatarUrl} />
          <Button onClick={handleSave} variant="contained">Save changes</Button>
        </Stack>
      </AppModal>
    </Stack>
  );
}
