import { memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

export interface SummaryMetric {
  label: string;
  value: string;
  helper: string;
  tone?: "primary" | "secondary" | "success" | "warning" | "info" | "error";
  sparkline?: {
    data: number[];
    labels: string[];
  };
  emptyFallback?: string;
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
      {metrics.map((metric) => {
        const paletteKey = metric.tone ?? "primary";
        const accentColor =
          theme.palette[paletteKey]?.main ?? theme.palette.primary.main;
        const sparkline = metric.sparkline;
        const hasSparkline = sparkline && sparkline.data.length > 0;
        const hasSignal = hasSparkline
          ? sparkline.data.some((value) => Number.isFinite(value) && value !== 0)
          : false;

        return (
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
            <Box mt={0.5} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {metric.helper}
              </Typography>
            </Box>
            {hasSparkline ? (
              <Box mt={3} display="flex" flexDirection="column" gap={1}>
                <SparkLineChart
                  data={sparkline.data}
                  xAxis={{ data: sparkline.labels }}
                  height={72}
                  colors={[accentColor]}
                  area
                  curve="monotoneX"
                  showTooltip={false}
                  showHighlight={false}
                />
                {metric.emptyFallback && !hasSignal && (
                  <Typography variant="caption" color="text.secondary">
                    {metric.emptyFallback}
                  </Typography>
                )}
              </Box>
            ) : metric.emptyFallback ? (
              <Typography variant="caption" color="text.secondary" display="block" mt={3}>
                {metric.emptyFallback}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}

const SummaryCards = memo(SummaryCardsComponent);
export default SummaryCards;
