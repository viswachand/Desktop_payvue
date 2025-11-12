import React from "react";
import { Box, Typography, Divider, useTheme } from "@/components/common";
import { Stack } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { selectAdminConfig } from "@/features/admin/adminSlice";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";


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

const FALLBACK_STORE = {
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
  const adminConfig = useSelector(selectAdminConfig);

  const store = React.useMemo(() => {
    if (!adminConfig) return FALLBACK_STORE;

    const cityLine = [adminConfig.companyCity, adminConfig.companyPostalCode]
      .filter(Boolean)
      .join(", ");

    return {
      name: adminConfig.companyName || FALLBACK_STORE.name,
      address1: adminConfig.companyAddress || FALLBACK_STORE.address1,
      city: cityLine || FALLBACK_STORE.city,
      phone: adminConfig.companyPhone
        ? formatPhoneNumber(adminConfig.companyPhone)
        : FALLBACK_STORE.phone,
      website: adminConfig.companyWebsite || FALLBACK_STORE.website,
    };
  }, [adminConfig]);

  return (
    <Box
      className="receipt-content"
      sx={{
        width: "100%",
        maxWidth: "100%",
        lineHeight: 1.4,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        p: 1,
        boxSizing: "border-box",
      }}
    >
      <Stack alignItems="center" spacing={0.3} sx={{ mb: 1.5 }}>
        <Typography variant="body1" fontWeight={700}>
          {store.name}
        </Typography>
        <Typography variant="caption">{store.address1}</Typography>
        <Typography variant="caption">{store.city}</Typography>
        <Typography variant="caption">{store.phone}</Typography>
      </Stack>

      <Box display="flex" justifyContent="center" my={1}>
        <QRCodeCanvas value={store.website} size={70} />
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
          </Typography>
          <Typography variant="caption">{comment}</Typography>
        </Box>
      )}

      {policyDescription && (
        <Box mb={0.5} mt={1}>
          <Typography variant="caption" fontWeight={600}>
            Policy:
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: "0.65rem",
              lineHeight: 1.4,
              textAlign: "justify",
              color: theme.palette.text.secondary,
            }}
          >
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
