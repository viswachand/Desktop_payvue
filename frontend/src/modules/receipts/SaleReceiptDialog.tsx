import React from "react";
import { Button, Divider, Box, useTheme } from "@/components/common";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import InventoryReceipt from "./InventoryReceipt";
import type { Sale } from "@payvue/shared/types/sale";
import { RECEIPT_WIDTH } from "@/modules/receipts/constants";
import { printReceipt } from "@/utils/printReceipt";

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleReceiptDialog({ sale, onClose }: Props) {
  const theme = useTheme();
  if (!sale) return null;

  const handlePrint = () => {
    printReceipt(sale);
  };

  return (
    <Dialog
      open={!!sale}
      onClose={onClose}
      maxWidth={false}
      fullWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: theme.shape.borderRadius,
            p: 0,
            overflow: "hidden",
            width: RECEIPT_WIDTH,
            maxWidth: RECEIPT_WIDTH,
            minWidth: RECEIPT_WIDTH,
            m: "auto",
          },
        },
      }}
    >
      <DialogContent dividers sx={{ backgroundColor: theme.palette.background.paper, p: 0 }}>
        <Box
          id="printable-receipt"
          sx={{
            width: "100%",
            maxWidth: RECEIPT_WIDTH,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <InventoryReceipt data={sale} />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
