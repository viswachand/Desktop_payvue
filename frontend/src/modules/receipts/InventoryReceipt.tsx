import React from "react";
import { Box, Typography, Divider, Grid } from "@/components/common";
import ReceiptLayout from "./ReceiptLayout";
import LayawaySection from "./LayawaySection";
import type { Sale, SaleItem } from "@payvue/shared/types/sale";
import { formatCurrency } from "@/utils/formatCurrency";


function InventoryReceipt({ data }: { data: Sale }) {
  const {
    invoiceNumber,
    createdAt,
    customerInformation,
    policyDescription,
    comment,
    saleType,
    installments = [],
    items = [],
    subtotal = 0,
    tax = 0,
    discountTotal = 0,
    total = 0,
    isLayaway,
  } = data;

  const paidAmount = installments.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const balance = Math.max(total - paidAmount, 0);
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <ReceiptLayout
      title="Sales Receipt"
      invoiceNumber={invoiceNumber}
      invoiceDate={date}
      customerName={`${customerInformation?.firstName ?? ""} ${
        customerInformation?.lastName ?? ""
      }`}
      phone={customerInformation?.phone ?? "—"}
      policyDescription={policyDescription}
      comment={comment}
      salesType={saleType}
      paymentType={isLayaway ? "Layaway" : "Full Payment"}
      summarySection={
        <Box sx={{ mt: 1.5, fontSize: "11px", textAlign: "right" }}>
          <Typography variant="caption" display="block">
            Subtotal: {formatCurrency(subtotal)}
          </Typography>
          <Typography variant="caption" display="block">
            Discount: {formatCurrency(discountTotal)}
          </Typography>
          <Typography variant="caption" display="block">
            Tax: {formatCurrency(tax)}
          </Typography>
          <Divider sx={{ borderStyle: "dashed", my: 0.5 }} />
          <Typography variant="caption" fontWeight={700} display="block">
            Grand Total: {formatCurrency(total)}
          </Typography>

          {isLayaway && (
            <>
              <Typography variant="caption" display="block">
                Paid: {formatCurrency(paidAmount)}
              </Typography>
              <Typography variant="caption" display="block">
                Balance: {formatCurrency(balance)}
              </Typography>
            </>
          )}
        </Box>
      }
      footerSection={
        isLayaway && installments.length > 0 ? (
          <LayawaySection installments={installments} />
        ) : null
      }
      signature={data.signature}
    >
      <Box sx={{ borderBottom: "1px dashed #999", pb: 0.5, mb: 0.5 }}>
        <Grid container spacing={0.5}>
          <Grid size={5}>
            <Typography variant="caption" fontWeight={700}>
              Item
            </Typography>
          </Grid>
          <Grid size={2.5}>
            <Typography variant="caption" fontWeight={700} align="right">
              Price
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant="caption" fontWeight={700} align="right">
              Qty
            </Typography>
          </Grid>
          <Grid size={2.5}>
            <Typography variant="caption" fontWeight={700} align="right">
              Total
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {items.map((it: SaleItem, i) => (
        <Grid container spacing={0.5} key={i} sx={{ mb: 0.3 }}>
          <Grid size={5}>
            <Typography variant="caption" noWrap>
              {it.name}
            </Typography>
          </Grid>
          <Grid size={2.5}>
            <Typography variant="caption" align="right">
              {formatCurrency(it.costPrice ?? 0)}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant="caption" align="right">
              {it.quantity ?? 1}
            </Typography>
          </Grid>
          <Grid size={2.5}>
            <Typography variant="caption" align="right">
              {formatCurrency((it.costPrice ?? 0) * (it.quantity ?? 1))}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </ReceiptLayout>
  );
}

export default React.memo(InventoryReceipt);
