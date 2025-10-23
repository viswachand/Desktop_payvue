import { memo, useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type SaleTypeKey = "inventory" | "service" | "custom" | "layaway" | "gold_buy";

export interface TrendPoint {
  label: string;
  inventory: number;
  service: number;
  custom: number;
  layaway: number;
  gold_buy: number;
  [key: string]: string | number; 
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
  const [view, setView] = useState<"week" | "month">("week");

  const dataset = view === "week" ? datasets.week : datasets.month;
  const formatCurrency = (value: number | null | undefined) =>
    (value ?? 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });

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
      {/* Header with title + toggle */}
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

      {/* Chart Area */}
      {hasValues ? (
        <BarChart
          dataset={dataset}
          xAxis={[{ dataKey: "label", scaleType: "band", label: "" }]}
          series={seriesConfig.map((series, index) => ({
            dataKey: series.key,
            label: series.label,
            color: colorPalette[index % colorPalette.length],
            valueFormatter: (value: number | null | undefined) => formatCurrency(value),
            highlightScope: { highlighted: "series", faded: "global" },
          }))}
          height={320}
          margin={{ top: 24, right: 32, bottom: 72, left: 20 }}
          slotProps={{
            legend: {
              hidden: false,
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              itemMarkWidth: 12,
              itemMarkHeight: 12,
              labelStyle: {
                fontSize: 13,
                fontWeight: 500,
                textTransform: "capitalize",
              },
            },
          }}
          yAxis={[{ label: "", valueFormatter: (value: number) => formatCurrency(value) }]}
          sx={{
            "& .MuiBarElement-root": {
              filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.18))",
            },
            "& .MuiChartsAxis-tickLabel": {
              fontSize: 12,
            },
          }}
        />
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height={320}>
          <Typography variant="body2" color="text.secondary">
            Charts unavailable or no sales recorded for this range.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const SalesTrendChart = memo(SalesTrendChartComponent);
export default SalesTrendChart;
