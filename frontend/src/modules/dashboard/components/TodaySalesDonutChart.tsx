import { memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

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
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const hasData = total > 0;
  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
  ];

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

      {hasData ? (
        <>
          <PieChart
            height={260}
            series={[
              {
                data: data.map((segment) => ({
                  id: segment.id,
                  value: segment.value,
                  label: segment.label,
                  color: colorPalette[segment.id % colorPalette.length],
                })),
                innerRadius: 60,
                paddingAngle: 4,
              },
            ]}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            slotProps={{
              legend: { hidden: true },
            }}
          />
          <Box
            mt={2.5}
            display="flex"
            flexWrap="wrap"
            gap={1.5}
            justifyContent="center"
          >
            {data.map((segment) => (
              <Box
                key={segment.id}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: colorPalette[segment.id % colorPalette.length],
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {segment.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
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
