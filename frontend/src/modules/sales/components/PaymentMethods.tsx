import { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@/components/common";
import type { PaymentMethod } from "@payvue/shared/types/sale";

interface Installment {
  method: PaymentMethod;
  amount: number;
}

interface PaymentMethodsProps {
  totalAmount?: number;
  isLayaway?: boolean;
  onInstallmentsChange?: (installments: Installment[]) => void;
}

// Display names for UI but map to backend values
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

  // 💰 Calculate totals
  const totalPaid = useMemo(
    () => installments.reduce((sum, i) => sum + i.amount, 0),
    [installments]
  );
  const remaining = Math.max(totalAmount - totalPaid, 0);

  // ➕ Add a payment method
  const handleAddPayment = () => {
    const numAmount = Number(amount);
    if (!selectedMethod || !numAmount || numAmount <= 0) return;

    // If not layaway, prevent overpaying
    if (!isLayaway && totalPaid + numAmount > totalAmount) {
      alert("⚠ Payment exceeds total amount.");
      return;
    }

    const updated = [...installments, { method: selectedMethod, amount: numAmount }];
    setInstallments(updated);
    setAmount("");
    setSelectedMethod(null);
    onInstallmentsChange?.(updated);
  };

  // ❌ Remove a payment method
  const handleRemove = (method: PaymentMethod) => {
    const updated = installments.filter((i) => i.method !== method);
    setInstallments(updated);
    onInstallmentsChange?.(updated);
  };

  // 💬 Amount input validation
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

      {/* 💰 Total to Pay */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Amount to Pay
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          value={totalAmount.toFixed(2)}
          disabled
          sx={{
            width: 120,
            "& .MuiInputBase-input": { textAlign: "right" },
          }}
        />
      </Box> */}

      {/* 🔘 Method Buttons */}
      <Grid container spacing={1.2} mb={2}>
        {METHODS.map((m) => (
          <Grid size={{  md: 3 }} key={m.value}>
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
                    ? "#fff"
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

      {/* 💵 Amount + Add */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          label="Amount"
          variant="outlined"
          size="small"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          sx={{ flex: 1 }}
          inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPayment}
          disabled={!selectedMethod || !amount}
          sx={{
            fontWeight: 600,
            borderRadius: 1.5,
            textTransform: "none",
            px: 3,
          }}
        >
          + Add
        </Button>
      </Box>

      {/* 📜 Added Payments */}
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
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleRemove(i.method)}
                  sx={{
                    textTransform: "none",
                    minWidth: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  ✕
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* 📊 Summary */}
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
    </Box>
  );
}
