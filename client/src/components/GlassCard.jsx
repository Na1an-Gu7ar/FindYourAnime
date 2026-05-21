import { Card } from '@mui/material';

export default function GlassCard({ children, sx, ...props }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.22)',
        ...sx
      }}
      {...props}
    >
      {children}
    </Card>
  );
}
