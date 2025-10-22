import React from "react";
import {
  Dialog,
  DialogContent,

} from "@mui/material";
import { useTheme,  Box } from "@/components/common";

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
  const theme = useTheme();

  return (
    <Dialog
      open={Boolean(sale)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
       slotProps={{
        paper: {
          sx: { borderRadius: theme.shape.borderRadius, p: 0, overflow: "hidden" },
        },
      }}
    >

      <DialogContent
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
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
