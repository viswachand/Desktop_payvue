import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import type { Sale } from "@payvue/shared/types/sale";

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleReceiptDialog({ sale, onClose }: Props) {
  const theme = useTheme();

  if (!sale) return null;

  // Safe derived values with fallbacks
  const subtotal = sale.subtotal ?? 0;
  const tax = sale.tax ?? 0;
  const total = sale.total ?? 0;
  const createdAt = sale.createdAt ? new Date(sale.createdAt) : null;

  return (
    <Dialog open={!!sale} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Invoice #{sale.invoiceNumber ?? "N/A"}
      </DialogTitle>
      <Divider />

      <DialogContent dividers>
        {/* 🧾 Customer Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Customer
          </Typography>
          <Typography variant="body2">
            {sale.customerInformation?.firstName || "N/A"}{" "}
            {sale.customerInformation?.lastName || ""}
          </Typography>
          {sale.customerInformation?.phone && (
            <Typography variant="body2" color="text.secondary">
              {sale.customerInformation.phone}
            </Typography>
          )}
          {sale.customerInformation?.email && (
            <Typography variant="body2" color="text.secondary">
              {sale.customerInformation.email}
            </Typography>
          )}
        </Box>

        {/* 📦 Sale Info */}
        <Typography variant="body2" gutterBottom>
          <strong>Sale Type:</strong> {(sale.saleType ?? "").toUpperCase()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Status:</strong> {sale.status ?? "N/A"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Date:</strong>{" "}
          {createdAt
            ? createdAt.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 🧩 Items */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Items
        </Typography>
        {Array.isArray(sale.items) && sale.items.length > 0 ? (
          sale.items.map((i, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="body2">
                {i.name ?? "Unnamed"} × {i.quantity ?? 1}
              </Typography>
              <Typography variant="body2">
                ${i.costPrice?.toFixed(2) ?? "0.00"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No items available
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 💰 Totals */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          <Typography variant="body2">
            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body2">
            Tax: <strong>${tax.toFixed(2)}</strong>
          </Typography>
          {sale.discountTotal && sale.discountTotal > 0 && (
            <Typography variant="body2" color="text.secondary">
              Discount: -${sale.discountTotal.toFixed(2)}
            </Typography>
          )}
          <Typography
            variant="h6"
            fontWeight={700}
            align="right"
            sx={{ mt: 1, color: theme.palette.primary.main }}
          >
            Total: ${total.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 🏷️ Policy */}
        {sale.policyTitle && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Policy: {sale.policyTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sale.policyDescription || "No description provided"}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
        <Button
          onClick={() => window.print()}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Print
        </Button>
      </DialogActions>

      {/* 🖨️ Hide chrome when printing */}
      <style>
        {`
          @media print {
            .MuiDialog-paper {
              box-shadow: none !important;
              border: none !important;
            }
            button {
              display: none !important;
            }
          }
        `}
      </style>
    </Dialog>
  );
}
