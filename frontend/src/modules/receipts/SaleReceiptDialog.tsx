import React from "react";
import { Button, Divider, Box, useTheme } from "@/components/common";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import InventoryReceipt from "./InventoryReceipt";
import type { Sale } from "@payvue/shared/types/sale";
import { RECEIPT_WIDTH } from "@/modules/receipts/constants";

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleReceiptDialog({ sale, onClose }: Props) {
  const theme = useTheme();
  if (!sale) return null;

  const handlePrint = () => {
    const receipt = document.getElementById("printable-receipt");
    if (!receipt) return;

    // Clone all MUI + global styles
    const styleTags = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    // 🔹 Capture QR canvas and convert to base64 (smaller size)
    const qrCanvas = receipt.querySelector("canvas");
    let qrImageHtml = "";
    if (qrCanvas) {
      try {
        const dataUrl = (qrCanvas as HTMLCanvasElement).toDataURL("image/png");
        qrImageHtml = `<img src="${dataUrl}" width="64" height="64" />`; // 👈 Reduced size
      } catch {
        console.warn("QR canvas conversion failed");
      }
    }

    // Clone receipt HTML, replacing the QR <canvas> with the <img>
    let receiptHtml = receipt.outerHTML;
    if (qrImageHtml) {
      receiptHtml = receiptHtml.replace(/<canvas[\s\S]*?<\/canvas>/, qrImageHtml);
    }

    // Open print window safely (no deprecated write)
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.writeln(`
      <html>
        <head>
          <title>Receipt - ${sale?.invoiceNumber ?? ""}</title>
          ${styleTags}
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              font-family: monospace;
              font-size: 11px;
            }
            #printable-receipt {
              width: 80mm;
              padding: 4mm;
              box-sizing: border-box;
            }
            img {
              display: block;
              margin: auto;
            }
          </style>
        </head>
        <body>${receiptHtml}</body>
      </html>
    `);
    printWindow.document.close();

    // Wait to ensure styles and images render
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 600);
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
        <Box id="printable-receipt">
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
