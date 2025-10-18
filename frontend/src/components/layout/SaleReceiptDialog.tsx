import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { Sale } from "@payvue/shared/types/sale";
import PrintableReceipt from "@/modules/receipts/PrintableReceipt"; 

interface SaleReceiptDialogProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleReceiptDialog({
  sale,
  onClose,
}: SaleReceiptDialogProps) {
  if (!sale) return null;

  return (
    <Dialog
      open={Boolean(sale)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, p: 0, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          fontSize: "1rem",
          pb: 1,
        }}
      >
        Sale Receipt
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent
        sx={{
          p: 2,
          backgroundColor: "#fafafa",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Box id="printable-receipt">
          <PrintableReceipt data={sale} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
