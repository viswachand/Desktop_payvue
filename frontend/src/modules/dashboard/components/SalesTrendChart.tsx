import { memo, useEffect, useState, type ComponentType } from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme } from "@mui/material";

type SaleTypeKey = "inventory" | "service" | "custom" | "layaway" | "gold_buy";

export interface TrendPoint {
  label: string;
  inventory: number;
  service: number;
  custom: number;
  layaway: number;
  gold_buy: number;
}

interface SalesTrendChartProps {
  datasets: {
    week: TrendPoint[];
    month: TrendPoint[];
  };
}

const seriesConfig: Array<{ key: SaleTypeKey; label: string }> = [
  { key: "inventory", label: "Inventory" },
  { key: "service", label: "Service" },
  { key: "custom", label: "Custom" },
  { key: "layaway", label: "Layaway" },
  { key: "gold_buy", label: "Gold Buy" },
];

function SalesTrendChartComponent({ datasets }: SalesTrendChartProps) {
  const theme = useTheme();
  const [LineChartComponent, setLineChartComponent] = useState<ComponentType<any> | null>(null);
  const [view, setView] = useState<"week" | "month">("week");
  const dataset = view === "week" ? datasets.week : datasets.month;
  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
  ];
  const hasValues = dataset.some((point) =>
    seriesConfig.some((series) => point[series.key] > 0)
  );

  useEffect(() => {
    let active = true;
    import("@mui/x-charts")
      .then((module: { LineChart?: ComponentType<any> }) => {
        if (active && module.LineChart) {
          setLineChartComponent(() => module.LineChart!);
        }
      })
      .catch(() => {
        if (active) setLineChartComponent(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.customShadows?.card,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Sales Trend
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, next) => {
            if (next) setView(next);
          }}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {LineChartComponent && hasValues ? (
        <LineChartComponent
          height={320}
          dataset={dataset}
          xAxis={[{ dataKey: "label", scaleType: "point" }]}
          series={seriesConfig.map((series, index) => ({
            dataKey: series.key,
            label: series.label,
            color: colorPalette[index % colorPalette.length],
          }))}
          margin={{ top: 20, right: 20, bottom: 100, left: 50 }}
          slotProps={{
            legend: {
              hidden: false,
              direction: "row",
              position: { vertical: "bottom", horizontal: "center" },
            },
          }}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={320}
        >
          <Typography variant="body2" color="text.secondary">
            Charts unavailable. Install @mui/x-charts to view this visualization.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const SalesTrendChart = memo(SalesTrendChartComponent);
export default SalesTrendChart;
