import { memo, useEffect, useState, type ComponentType } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface DonutDatum {
  id: number;
  label: string;
  value: number;
}

interface TodaySalesDonutChartProps {
  data: DonutDatum[];
}

function TodaySalesDonutChartComponent({ data }: TodaySalesDonutChartProps) {
  const theme = useTheme();
  const [PieChartComponent, setPieChartComponent] = useState<ComponentType<any> | null>(null);
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const hasData = total > 0;

  useEffect(() => {
    let active = true;
    import("@mui/x-charts")
      .then((module: { PieChart?: ComponentType<any> }) => {
        if (active && module.PieChart) {
          setPieChartComponent(() => module.PieChart!);
        }
      })
      .catch(() => {
        if (active) setPieChartComponent(null);
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
      <Typography variant="h6" fontWeight={600} mb={2}>
        Today's Sales Mix
      </Typography>

      {hasData && PieChartComponent ? (
        <Box
          sx={{
            position: "relative",
            pb: 4, // ⬅️ Creates extra space for the legend to breathe
          }}
        >
          <PieChartComponent
            height={260}
            series={[
              {
                data: data.map((segment) => ({
                  id: segment.id,
                  value: segment.value,
                  label: segment.label,
                })),
                innerRadius: 60,
                paddingAngle: 4,
              },
            ]}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Charts unavailable or no sales recorded today.
        </Typography>
      )}
    </Box>
  );
}

const TodaySalesDonutChart = memo(TodaySalesDonutChartComponent);
export default TodaySalesDonutChart;
