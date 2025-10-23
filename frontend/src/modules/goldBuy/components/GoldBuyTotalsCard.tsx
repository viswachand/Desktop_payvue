import { Card, CardContent, Typography, Box, Divider, LinearProgress } from "@mui/material";
import { calculateGoldBuyTotals, GoldBuyTotals } from "@/utils/goldBuy";
import type { GoldBuyItem } from "@payvue/shared/types/goldBuy";

interface GoldBuyTotalsCardProps {
  items: Pick<GoldBuyItem, "fineGoldGrams" | "lineFees">[];
  pricing: {
    livePricePerGram24k: number;
    buyRate: number;
    fees: { testFee: number; refiningPerGram: number };
  };
}

export default function GoldBuyTotalsCard({ items, pricing }: GoldBuyTotalsCardProps) {
  const totals: GoldBuyTotals = calculateGoldBuyTotals(items, {
    livePricePerGram24k: pricing.livePricePerGram24k,
    buyRate: pricing.buyRate,
    fees: {
      testFee: pricing.fees.testFee,
      refiningPerGram: pricing.fees.refiningPerGram,
    },
  });

  const progress =
    totals.gross > 0 ? Math.min(((totals.gross - totals.fees) / totals.gross) * 100, 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Projected Payout
        </Typography>
        <Typography variant="h4" fontWeight={700} mt={1}>
          ${totals.payout.toFixed(2)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="grid" gridTemplateColumns="1fr 1fr" rowGap={1.5}>
          <Typography variant="body2" color="text.secondary">
            Fine Gold
          </Typography>
          <Typography variant="body2" textAlign="right">
            {totals.fineGoldGrams.toFixed(3)} g
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Gross Offer
          </Typography>
          <Typography variant="body2" textAlign="right">
            ${totals.gross.toFixed(2)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Fees
          </Typography>
          <Typography variant="body2" textAlign="right">
            -${totals.fees.toFixed(2)}
          </Typography>
        </Box>

        <Box mt={3}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 999,
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption" color="text.secondary">
              Net after fees
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
