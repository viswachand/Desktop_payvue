import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@/components/common";
import { Snackbar } from "@/components/common";
import type { PaymentMethod } from "@payvue/shared/types/sale";
import { IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"; 


interface Installment {
  method: PaymentMethod;
  amount: number;
}

interface PaymentMethodsProps {
  totalAmount?: number;
  isLayaway?: boolean;
  onInstallmentsChange?: (installments: Installment[]) => void;
}

const METHODS: { label: string; value: PaymentMethod }[] = [
  { label: "Cash", value: "cash" },
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
  { label: "Others", value: "others" },
];

export default function PaymentMethods({
  totalAmount = 0,
  isLayaway = false,
  onInstallmentsChange,
}: PaymentMethodsProps) {
  const theme = useTheme();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");
  const [installments, setInstallments] = useState<Installment[]>([]);

  // ✅ Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const totalPaid = useMemo(
    () => installments.reduce((sum, i) => sum + i.amount, 0),
    [installments]
  );
  const remaining = Math.max(totalAmount - totalPaid, 0);

  const handleAddPayment = () => {
    const numAmount = Number(amount);
    if (!selectedMethod || !numAmount || numAmount <= 0) {
      setSnackbar({
        open: true,
        message: "Please select a method and enter a valid amount.",
        severity: "warning",
      });
      return;
    }

    if (!isLayaway && totalPaid + numAmount > totalAmount) {
      setSnackbar({
        open: true,
        message: "Payment exceeds total amount.",
        severity: "error",
      });
      return;
    }

    const updated = [
      ...installments,
      { method: selectedMethod, amount: numAmount },
    ];
    setInstallments(updated);
    setAmount("");
    setSelectedMethod(null);
    onInstallmentsChange?.(updated);

    setSnackbar({
      open: true,
      message: "Payment added successfully!",
      severity: "success",
    });
  };

  const handleRemove = (method: PaymentMethod) => {
    const updated = installments.filter((i) => i.method !== method);
    setInstallments(updated);
    onInstallmentsChange?.(updated);
    setSnackbar({
      open: true,
      message: "Payment removed.",
      severity: "info",
    });
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) setAmount(val);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2.5,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* 🏷 Header */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Payment Methods
      </Typography>

      {/* 💳 Payment Buttons */}
      <Grid container spacing={1.2} mb={2}>
        {METHODS.map((m) => (
          <Grid size={{ md: 3 }} key={m.value}>
            <Button
              fullWidth
              variant={selectedMethod === m.value ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedMethod(m.value)}
              sx={{
                height: 44,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                backgroundColor:
                  selectedMethod === m.value
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                color:
                  selectedMethod === m.value
                    ? theme.palette.background.paper
                    : theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    selectedMethod === m.value
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                },
              }}
            >
              {m.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter Amount"
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              inputMode: "decimal",
              style: { textAlign: "right" },
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPayment}
          disabled={!selectedMethod || !amount}
          sx={{
            fontWeight: 600,
            borderRadius: theme.shape.borderRadius,
            textTransform: "none",
            px: 2,
            height: 40,
            minWidth: 100,
          }}
        >
          + Add
        </Button>
      </Box>

      {/* 💵 Added Payments */}
      {installments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            color="text.secondary"
          >
            Added Payments
          </Typography>
          {installments.map((i) => (
            <Box
              key={i.method}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.6,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontWeight={500} textTransform="capitalize">
                {i.method}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>${i.amount.toFixed(2)}</Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemove(i.method)}
                  sx={{
                    p: 0.5,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          display="flex"
          justifyContent="space-between"
        >
          <span>Total Paid:</span>
          <strong>${totalPaid.toFixed(2)}</strong>
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color:
              remaining === 0
                ? theme.palette.success.main
                : isLayaway
                ? theme.palette.warning.main
                : theme.palette.error.main,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Remaining:</span>
          <strong>${remaining.toFixed(2)}</strong>
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
