import { memo, useEffect, useState, type ComponentType } from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme } from "@mui/material";

interface RevenueDatum {
  label: string;
  value: number;
}

interface RevenueBreakdownChartProps {
  datasets: {
    week: RevenueDatum[];
    month: RevenueDatum[];
  };
}

function RevenueBreakdownChartComponent({ datasets }: RevenueBreakdownChartProps) {
  const theme = useTheme();
  const [BarChartComponent, setBarChartComponent] = useState<ComponentType<any> | null>(null);
  const [view, setView] = useState<"week" | "month">("week");
  const dataset = view === "week" ? datasets.week : datasets.month;

  useEffect(() => {
    let active = true;
    import("@mui/x-charts")
      .then((module: { BarChart?: ComponentType<any> }) => {
        if (active && module.BarChart) {
          setBarChartComponent(() => module.BarChart!);
        }
      })
      .catch(() => {
        if (active) setBarChartComponent(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const hasData = dataset.some((entry) => entry.value > 0);

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
          Revenue Breakdown
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

      {BarChartComponent && hasData ? (
        <BarChartComponent
          height={320}
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "label" }]}
          series={[{ dataKey: "value" }]}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={320}
        >
          <Typography variant="body2" color="text.secondary">
            Charts unavailable or no revenue recorded in the selected range.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const RevenueBreakdownChart = memo(RevenueBreakdownChartComponent);
export default RevenueBreakdownChart;
