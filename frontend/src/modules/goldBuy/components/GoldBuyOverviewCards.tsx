import { Typography, Paper, Box, useTheme } from "@mui/material";
import type { GoldBuy } from "@payvue/shared/types/goldBuy";

interface GoldBuyOverviewCardsProps {
  records: GoldBuy[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function GoldBuyOverviewCards({ records }: GoldBuyOverviewCardsProps) {
  const theme = useTheme();

  const active = records.filter((ticket) => !["cancelled", "void"].includes(ticket.status));
  const totalPayout = active.reduce((sum, ticket) => sum + (ticket.totals?.payout ?? 0), 0);
  const fineGold = active.reduce((sum, ticket) => sum + (ticket.totals?.fineGoldGrams ?? 0), 0);

  const highlights = [
    {
      label: "Open Tickets",
      value: active.length,
      helper: `${records.length} total`,
    },
    {
      label: "Projected Payout",
      value: formatCurrency(totalPayout),
      helper: "After fees",
    },
    {
      label: "Fine Gold Intake",
      value: `${fineGold.toFixed(3)} g`,
      helper: "Across open tickets",
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
      gap={2}
    >
      {highlights.map((card) => (
        <Paper
          key={card.label}
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%)"
                : theme.palette.background.paper,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {card.label}
          </Typography>
          <Typography variant="h5" fontWeight={700} mt={1}>
            {card.value}
          </Typography>
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              {card.helper}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
