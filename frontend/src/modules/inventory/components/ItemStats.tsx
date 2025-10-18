import React, { useMemo } from "react";
import { Card, Typography, Box, useTheme } from "@/components/common";
import { CardContent } from "@mui/material";
import { Grid } from "@/components/common";
import type { Item } from "@payvue/shared/types/item";

// Format currency nicely
const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

interface Props {
  items: Item[];
}

export default function ItemStats({ items }: Props) {
  const theme = useTheme();


  const { totalItems, totalValue, soldItems } = useMemo(() => {
    const soldItems = items.filter((i) => i.isSold).length;


    const inStockItems = items.filter((i) => !i.isSold);
    const totalItems = inStockItems.length;

    const totalValue = inStockItems.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
      0
    );

    return { totalItems, totalValue, soldItems };
  }, [items]);

  const stats = [
    {
      label: "Total Items",
      value: totalItems.toString(),
      icon: "📦",
      color: theme.palette.primary.main,
      bg: theme.palette.background.paper,
    },
    {
      label: "Total Value",
      value: formatCurrency(totalValue),
      icon: "💰",
      color: theme.palette.info.main,
      bg: theme.palette.background.paper,
    },
    {
      label: "Sold Items",
      value: soldItems.toString(),
      icon: "🛒",
      color: theme.palette.success.main,
      bg: theme.palette.background.paper,
    },
    {
      label: "Vendors",
      value: 1,
      icon: "👥",
      color: theme.palette.success.main,
      bg: theme.palette.background.paper,
    },
  ];

  return (
    <Grid spacing={2} sx={{ width: "100%", margin: "0 auto" }} >
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            sx={{
              width: "100%",
              minHeight: 10,
              display: "flex",
              alignItems: "center",
              borderRadius: theme.shape.borderRadius,
              boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
              backgroundColor: theme.palette.background.paper,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent
              sx={{
                width: "100%",
                py: 2,
                "&:last-child": { pb: 2 },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {/* Left Icon */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: theme.shape.borderRadius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: stat.bg,
                    fontSize: 32,
                  }}
                >
                  <Box component="span" sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>

                {/* Right Text */}
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
