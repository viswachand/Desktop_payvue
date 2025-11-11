import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PrintableReceipt from "@/modules/receipts/PrintableReceipt";
import type { Sale } from "@payvue/shared/types/sale";
import {
  RECEIPT_PRINT_STORAGE_KEY,
  RECEIPT_WIDTH,
} from "@/modules/receipts/constants";

const isElectron = () =>
  typeof window !== "undefined" && Boolean(window.electronAPI);

export default function PrintReceiptPage() {
  const [sale, setSale] = useState<Sale | null>(null);

  // grab any payload stored before opening this window (browser workflow)
  useEffect(() => {
    const storedSale = localStorage.getItem(RECEIPT_PRINT_STORAGE_KEY);
    if (!storedSale) return;

    try {
      setSale(JSON.parse(storedSale));
    } catch (error) {
      console.error("Failed to parse stored receipt payload", error);
    } finally {
      localStorage.removeItem(RECEIPT_PRINT_STORAGE_KEY);
    }
  }, []);

  // listen for payloads pushed from the Electron main process
  useEffect(() => {
    if (!window.electronAPI?.onRenderReceipt) return;

    const unsubscribe = window.electronAPI.onRenderReceipt((_event, data) => {
      setSale(data);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  // trigger the browser print dialog when we're not in the silent Electron flow
  useEffect(() => {
    if (!sale || isElectron()) return;
    const timer = setTimeout(() => {
      window.print();
    }, 300);

    return () => clearTimeout(timer);
  }, [sale]);

  useEffect(() => {
    if (!sale || !isElectron()) return;
    window.electronAPI?.notifyPrintReady?.();
  }, [sale]);

  const content = useMemo(() => {
    if (!sale) {
      return (
        <Box
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary">
            Preparing receipt…
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        id="printable-receipt"
        sx={{
          width: RECEIPT_WIDTH,
          maxWidth: RECEIPT_WIDTH,
          minWidth: RECEIPT_WIDTH,
          mx: "auto",
          my: 2,
        }}
      >
        <PrintableReceipt data={sale} />
      </Box>
    );
  }, [sale]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {content}
    </Box>
  );
}
