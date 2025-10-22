import React from "react";
import { Box, Typography, Divider,useTheme } from "@/components/common";
import { Stack } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { RECEIPT_WIDTH } from "./constants";


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

function ReceiptLayout({
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
  const theme = useTheme();
  return (
    <Box
      id="printable-receipt"
      sx={{
        width: RECEIPT_WIDTH,
        lineHeight: 1.4,
        bgcolor: theme.palette.background.paper,
        border: `${theme.palette.divider} 1px solid`,
        p: 1,
      }}
    >
      <Stack alignItems="center" spacing={0.3} sx={{ mb: 1.5 }}>
        <Typography variant="body1" fontWeight={700}>
          {STORE.name}
        </Typography>
        <Typography variant="caption">{STORE.address1}</Typography>
        <Typography variant="caption">{STORE.city}</Typography>
        <Typography variant="caption">{STORE.phone}</Typography>
      </Stack>

      <Box display="flex" justifyContent="center" my={1}>
        <QRCodeCanvas value={STORE.website} size={70} />
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />
      <Typography variant="subtitle1" fontWeight={700} align="center" sx={{ my: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ borderStyle: "dashed" }} />

      <Stack direction="column" mt={1}>
        <Typography variant="caption">Invoice #: {invoiceNumber || "—"}</Typography>
        <Typography variant="caption">Customer: {customerName || "—"}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="caption">Date: {invoiceDate || "—"}</Typography>
        <Typography variant="caption">Phone: {phone || "—"}</Typography>
      </Stack>

      {children}
      <Box mt={1}>{summarySection}</Box>
      {footerSection && <Box mt={1}>{footerSection}</Box>}

      {(salesType || paymentType) && (
        <Box mt={1} mb={1}>
          {salesType && <Typography variant="caption">Sales Type: {salesType}</Typography>}
          {paymentType && (
            <>
              <br />
              <Typography variant="caption">Payment Type: {paymentType}</Typography>
            </>
          )}
        </Box>
      )}

      {comment && (
        <Box mb={0.5}>
          <Typography fontWeight={600} variant="caption">
            Comment:
          </Typography>{" "}
          {comment}
        </Box>
      )}

      {policyDescription && (
        <Box mb={0.5}>
          <Typography variant="caption" fontWeight={600}>
           {policyDescription}
          </Typography>
          
        </Box>
      )}

      <Typography
        align="center"
        variant="caption"
        sx={{ mt: 3,  borderTop: `1px dashed ${theme.palette.divider}`, display: "block", width: "100%", textAlign: "center", pt:1 }}
      >
        Thank you for shopping with us!
      </Typography>
    </Box>
  );
}

export default React.memo(ReceiptLayout);
