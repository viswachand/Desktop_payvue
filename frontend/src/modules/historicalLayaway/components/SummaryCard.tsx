import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function SummaryCard({ form }: any) {
  const subtotal =
    form.items?.reduce(
      (acc: number, i: any) => acc + (i.costPrice ?? 0) * (i.quantity ?? 1),
      0
    ) ?? 0;

  const totalPaid =
    form.installments?.reduce((acc: number, i: any) => acc + (i.amount ?? 0), 0) ?? 0;

  const balance = subtotal - totalPaid;

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="subtitle1">Summary</Typography>
        <Typography variant="body2">Subtotal: ${subtotal.toFixed(2)}</Typography>
        <Typography variant="body2">Paid: ${totalPaid.toFixed(2)}</Typography>
        <Typography variant="body2">Balance: ${balance.toFixed(2)}</Typography>
        <Typography variant="body2" color={balance > 0 ? "warning.main" : "success.main"}>
          Status: {balance > 0 ? "Installment" : "Paid"}
        </Typography>
      </CardContent>
    </Card>
  );
}
