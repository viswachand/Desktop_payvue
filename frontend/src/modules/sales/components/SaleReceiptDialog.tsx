import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Box,
} from "@mui/material";
import type { Sale } from "@payvue/shared/types/sale";
import InventoryReceipt from "@/modules/receipts/InventoryReceipt";

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleReceiptDialog({ sale, onClose }: Props) {
  if (!sale) return null;

  return (
    <Dialog
      open={!!sale}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          p: 1,
          backgroundColor: "white",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: "center",
          pb: 1,
        }}
      >
        Sales Receipt
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent dividers sx={{ backgroundColor: "white" }}>
        <Box id="printable-receipt">
          {/* 🧾 Render full receipt layout */}
          <InventoryReceipt data={sale} />
        </Box>
      </DialogContent>

      <Divider />

      {/* Footer buttons */}
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => window.print()}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Print
        </Button>
      </DialogActions>

      {/* 🖨 Print-specific styling */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              background: white !important;
            }

            /* Hide dialog chrome when printing */
            .MuiDialog-container,
            .MuiDialog-paper {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm !important;
              max-width: none !important;
            }

            /* Hide buttons during print */
            button, .MuiDialogActions-root {
              display: none !important;
            }
          }
        `}
      </style>
    </Dialog>
  );
}
