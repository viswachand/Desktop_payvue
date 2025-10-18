// src/modules/receipts/ReceiptLayout.tsx
import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

interface ReceiptLayoutProps {
  title: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  customerName?: string;
  phone?: string;
  policyDescription?: string;
  comment?: string;
  salesType?: string;
  paymentType?: string;
  children: React.ReactNode;
  summarySection: React.ReactNode;
  footerSection?: React.ReactNode;
}

const STORE = {
  name: "A-1 JEWELERS",
  address1: "5142 Wilson Mills Rd",
  city: "Ohio - 44143",
  phone: "440-460-0050",
  website: "https://amazingwholesalejewelry.com/",
};

export default function ReceiptLayout({
  title,
  invoiceNumber,
  invoiceDate,
  customerName,
  phone,
  policyDescription,
  comment,
  salesType,
  paymentType,
  children,
  summarySection,
  footerSection,
}: ReceiptLayoutProps) {
  return (
    <Box
      id="printable-receipt"
      sx={{
        width: "80mm",
        lineHeight: 1.4,
        fontFamily: "monospace",
        fontSize: "11px",
        bgcolor: "#fff",
        border: "1px solid #ddd",
        p: 1,
      }}
    >
      {/* --- HEADER --- */}
      <Stack alignItems="center" spacing={0.3} sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {STORE.name}
        </Typography>
        <Typography>{STORE.address1}</Typography>
        <Typography>{STORE.city}</Typography>
        <Typography>{STORE.phone}</Typography>
      </Stack>

      <Box display="flex" justifyContent="center" my={1}>
        <QRCodeCanvas value={STORE.website} size={70} />
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />
      <Typography
        variant="subtitle1"
        fontWeight={700}
        align="center"
        sx={{ my: 1 }}
      >
        {title}
      </Typography>
      <Divider sx={{ borderStyle: "dashed" }} />

      {/* --- CUSTOMER INFO --- */}
      <Stack direction="column" justifyContent="space-between" mt={1}>
        <Typography variant="caption">Invoice #: {invoiceNumber || "—"}</Typography>
        <Typography variant="caption">Customer: {customerName || "—"}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="caption">Date: {invoiceDate || "—"}</Typography>
        <Typography variant="caption">Phone: {phone || "—"}</Typography>
      </Stack>

      {/* --- ITEMS --- */}
      {children}

      {/* --- SUMMARY --- */}
      <Box mt={1}>{summarySection}</Box>

      {/* --- FOOTER (Layaway, etc.) --- */}
      {footerSection && <Box mt={1}>{footerSection}</Box>}

      {/* --- TRANSACTION INFO --- */}
      {(salesType || paymentType) && (
        <Box mt={1} mb={1}>
          {salesType && <Typography variant="caption">Sales Type: {salesType}</Typography> }
          <br></br>
          {paymentType && <Typography variant="caption">Payment Type: {paymentType}</Typography>}
        </Box>
      )}

      {/* --- COMMENT & POLICY --- */}
      {comment && (
        <Box mb={0.5}>
          <Typography fontWeight={600} variant="caption">Comment:</Typography>
          <Typography variant="caption">{comment}</Typography>
        </Box>
      )}

      {policyDescription && (
        <Box mb={0.5}>
          <Typography variant="caption" fontWeight={600}>Policy : </Typography>
          <Typography variant="caption" textAlign="justify">{policyDescription}</Typography>
        </Box>
      )}

      {/* --- THANK YOU FOOTER --- */}
      <Typography
        align="center"
        sx={{ mt: 3, fontSize: "10px", borderTop: "1px dashed #999", pt: 0.5 }}
      >
        Thank you for shopping with us!
      </Typography>

      {/* 🖨 Print Fallback for Electron */}
      <style>
        {`
          @media print {
            body * { visibility: hidden !important; }
            #printable-receipt, #printable-receipt * {
              visibility: visible !important;
            }
            #printable-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              font-family: monospace;
              font-size: 11px;
              background: white;
              padding: 4mm;
            }
          }
        `}
      </style>
    </Box>
  );
}
