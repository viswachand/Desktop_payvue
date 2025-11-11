import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { TextField, Button, Box } from "@/components/common";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { addLayawayPayment } from "@/features/layaway/layawaySlice";

interface Props {
  open: boolean;
  onClose: () => void;
  layawayId?: string;
  onSuccess: (updated: any) => void;
  balanceAmount: number;
}

const getTodayDate = () => new Date().toISOString().split("T")[0];
const toLocalMidnightISOString = (date: string) =>
  date ? `${date}T00:00:00` : undefined;

export default function AddPaymentDialog({
  open,
  onClose,
  layawayId,
  onSuccess,
  balanceAmount,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState<string>("0.00");
  const [method, setMethod] = useState<string>("cash");
  const [paymentDate, setPaymentDate] = useState<string>(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!layawayId || numericAmount <= 0) return;

    if (numericAmount > balanceAmount) {
      setError(`Amount exceeds remaining balance of ${balanceAmount}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resultAction = await dispatch(
        addLayawayPayment({
          id: layawayId,
          payload: {
            amount: numericAmount,
            method,
            paidAt: toLocalMidnightISOString(paymentDate),
          },
        })
      ).unwrap();

      onSuccess(resultAction);
      handleClose();
    } catch (err) {
      console.error("Failed to add payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("0.00");
    setMethod("cash");
    setPaymentDate(getTodayDate());
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Payment</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            fullWidth
            error={!!error}
          />
          {error && (
            <FormHelperText error sx={{ ml: 1 }}>
              {error}
            </FormHelperText>
          )}
          <TextField
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            select
            label="Payment Method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="debit">Debit</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
