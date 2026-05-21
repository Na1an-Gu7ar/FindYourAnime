import TranslateIcon from '@mui/icons-material/Translate';
import { Chip, Stack } from '@mui/material';

export default function LanguageBadges({ languages = [] }) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {languages.map((language) => (
        <Chip
          color={language.available ? 'primary' : 'default'}
          icon={<TranslateIcon />}
          key={language.code || language.label}
          label={language.label}
          variant={language.available ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  );
}
