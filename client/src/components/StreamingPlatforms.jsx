import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import GlassCard from './GlassCard.jsx';

export default function StreamingPlatforms({ platforms = [] }) {
  return (
    <Grid2 container spacing={2}>
      {platforms.map((platform) => (
        <Grid2 key={platform.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <GlassCard sx={{ height: '100%', p: 2 }}>
            <Stack spacing={2}>
              <Stack alignItems="center" direction="row" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'background.default', fontWeight: 900 }}>
                  {platform.logo}
                </Avatar>
                <Typography fontWeight={900}>{platform.name}</Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {platform.languages.map((language) => (
                  <Chip
                    key={language.label}
                    label={language.label}
                    size="small"
                    variant={language.available ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
              <Button
                component="a"
                endIcon={<OpenInNewIcon />}
                href={platform.watchUrl}
                rel="noreferrer"
                target="_blank"
                variant="outlined"
              >
                Watch legally
              </Button>
            </Stack>
          </GlassCard>
        </Grid2>
      ))}
    </Grid2>
  );
}
