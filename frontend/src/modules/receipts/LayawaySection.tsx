import React from "react";
import { Box, Typography, Divider,  Grid,useTheme } from "@mui/material";
import type { Installment } from "@payvue/shared/types/sale";
import { formatCurrency } from "@/utils/formatCurrency";

interface LayawaySectionProps {
  installments: Installment[];
}

function LayawaySection({ installments }: LayawaySectionProps) {
  const Theme = useTheme();
  if (!installments?.length) return null;

  return (
    <Box sx={{ mt: 1.5, pt: 0.5 }}>
      {/* <Divider sx={{ borderStyle: "dashed", mb: 0.5 }} /> */}

      <Typography
        variant="caption"
       
      >
       Payments
      </Typography>

      <Box sx={{ borderBottom: `1px dashed ${Theme.palette.divider}`, pb: 0.3, mb: 0.3 }}>
        <Grid container spacing={0.5}>
          <Grid size={5}>
            <Typography variant="caption" fontWeight={700}>
              Method
            </Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="caption" fontWeight={700} align="center">
              Date
            </Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="caption" fontWeight={700} align="right">
              Amount
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {installments.map((p, i) => (
        <Grid container spacing={0.5} key={i} sx={{ mb: 0.2 }}>
          <Grid size={5}>
            <Typography variant="caption">
              {p.method?.toUpperCase?.() ?? "METHOD"}
            </Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="caption" align="center">
              {p.paidAt
                ? new Date(p.paidAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="caption" align="right">
              {formatCurrency(p.amount ?? 0)}
            </Typography>
          </Grid>
        </Grid>
      ))}

      <Divider sx={{ borderStyle: "dashed", mt: 0.5 }} />
    </Box>
  );
}

export default React.memo(LayawaySection);
