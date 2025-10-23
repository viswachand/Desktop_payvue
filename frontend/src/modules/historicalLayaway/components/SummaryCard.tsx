import React from "react";
import { Card, CardContent, Typography, Box, Divider, LinearProgress } from "@mui/material";

interface SummaryTotals {
  subtotal: number;
  tax: number;
  discountTotal: number;
  total: number;
  paidAmount: number;
  balance: number;
}

interface SummaryCardProps {
  totals: SummaryTotals;
}

export default function SummaryCard({ totals }: SummaryCardProps) {
  const { subtotal, tax, discountTotal, total, paidAmount, balance } = totals;
  const progress = total > 0 ? Math.min((paidAmount / total) * 100, 100) : 0;
  const statusLabel = balance > 0 ? "Balance Due" : "Paid in Full";
  const statusColor = balance > 0 ? "warning.main" : "success.main";

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #fff 0%, #f6f7fb 100%)"
            : "linear-gradient(135deg, rgba(36,38,45,0.8) 0%, rgba(26,28,33,0.9) 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Overview
        </Typography>
        <Typography variant="h4" fontWeight={700} mt={1}>
          ${total.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total sale including taxes and discounts
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="grid" gridTemplateColumns="1fr 1fr" rowGap={1.5}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" textAlign="right">
            ${subtotal.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tax
          </Typography>
          <Typography variant="body2" textAlign="right">
            ${tax.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discounts
          </Typography>
          <Typography variant="body2" textAlign="right">
            -${discountTotal.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Paid
          </Typography>
          <Typography variant="body2" textAlign="right">
            ${paidAmount.toFixed(2)}
          </Typography>
        </Box>

        <Box mt={3}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 10,
              backgroundColor: (theme) => theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 10,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="caption" color="text.secondary">
              Paid {Math.round(progress)}%
            </Typography>
            <Typography variant="caption" color={statusColor} fontWeight={600}>
              {statusLabel}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} mt={2}>
            ${balance.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remaining balance
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
