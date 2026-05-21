import InboxIcon from '@mui/icons-material/Inbox';
import { Button, Stack, Typography } from '@mui/material';
import GlassCard from './GlassCard.jsx';

export default function EmptyState({ action, icon = <InboxIcon />, message, title }) {
  return (
    <GlassCard sx={{ p: 4 }}>
      <Stack alignItems="center" spacing={2} textAlign="center">
        {icon}
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
          {message}
        </Typography>
        {action ? <Button {...action}>{action.label}</Button> : null}
      </Stack>
    </GlassCard>
  );
}
