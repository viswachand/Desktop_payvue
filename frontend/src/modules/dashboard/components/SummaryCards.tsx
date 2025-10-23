import { memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";

export interface SummaryMetric {
  label: string;
  value: string;
  helper: string;
}

interface SummaryCardsProps {
  metrics: SummaryMetric[];
}

function SummaryCardsComponent({ metrics }: SummaryCardsProps) {
  const theme = useTheme();

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(auto-fit, minmax(220px, 1fr))" }}
      gap={2.5}
    >
      {metrics.map((metric) => (
        <Box
          key={metric.label}
          sx={{
            p: 3,
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.customShadows?.card,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography variant="h5" fontWeight={700} mt={1}>
            {metric.value}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {metric.helper}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const SummaryCards = memo(SummaryCardsComponent);
export default SummaryCards;
