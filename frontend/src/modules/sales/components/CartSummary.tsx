import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Snackbar,
} from "@/components/common";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  taxRate?: number;
  discountValue?: number;
  commentValue?: string;
  onDiscountChange?: (value: number) => void;
  onCommentChange?: (value: string) => void;
}

export default function CartSummary({
  subtotal,
  tax,
  total,
  taxRate,
  discountValue,
  commentValue,
  onDiscountChange,
  onCommentChange,
}: CartSummaryProps) {
  const theme = useTheme();

  const [showDiscount, setShowDiscount] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "error" | "warning" | "success"
  >("warning");

  const showSnack = useCallback(
    (message: string, severity: "error" | "warning" | "success") => {
      setSnackMessage(message);
      setSnackSeverity(severity);
      setSnackOpen(true);
    },
    []
  );

  useEffect(() => {
    if (showDiscount) {
      setDiscountInput(
        discountValue && discountValue > 0 ? discountValue.toString() : ""
      );
    }
  }, [showDiscount, discountValue]);

  useEffect(() => {
    if (showComment) {
      setCommentInput(commentValue ?? "");
    }
  }, [showComment, commentValue]);

  const handleDiscountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setDiscountInput(val);
    }
  };

  const handleAddDiscount = () => {
    const parsed = Number(discountInput);
    const grossTotal = total + (discountValue ?? 0);

    if (!discountInput || parsed <= 0)
      return showSnack("Enter a valid discount amount.", "warning");
    if (parsed > grossTotal)
      return showSnack("Discount cannot exceed total.", "error");

    onDiscountChange?.(parsed);
    setShowDiscount(false);
    setDiscountInput(parsed.toString());
    showSnack("Discount applied successfully.", "success");
  };

  const handleRemoveDiscount = () => {
    setDiscountInput("");
    onDiscountChange?.(0);
    showSnack("Discount removed.", "warning");
  };

  const handleAddComment = () => {
    if (!commentInput.trim())
      return showSnack("Comment cannot be empty.", "warning");
    onCommentChange?.(commentInput);
    setShowComment(false);
    showSnack("Comment added.", "success");
  };

  const appliedDiscount = discountValue ?? 0;
  const appliedComment = commentValue ?? "";

  return (
    <>
      <Box
        sx={{
          mt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setShowDiscount((prev) => !prev);
                setShowComment(false);
              }}
              sx={{
                textTransform: "none",
                color: showDiscount
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                fontWeight: showDiscount ? 600 : 400,
              }}
            >
              Discount
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={() => {
                setShowComment((prev) => !prev);
                setShowDiscount(false);
              }}
              sx={{
                textTransform: "none",
                color: showComment
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                fontWeight: showComment ? 600 : 400,
              }}
            >
              Comment
            </Button>
          </Stack>
        </Stack>

        {/* Discount Field */}
        {showDiscount && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                size="small"
                value={discountInput}
                onChange={handleDiscountInput}
                placeholder="0.00"
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": { height: 34, borderRadius: 1 },
                }}
                inputProps={{ inputMode: "decimal" }}
              />
              <IconButton
                color="primary"
                size="small"
                onClick={handleAddDiscount}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        )}

        {/* Comment Field */}
        {showComment && (
          <Stack spacing={1} mb={1.5}>
            <TextField
              multiline
              rows={2}
              fullWidth
              value={commentInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCommentInput(e.target.value)
              }
              placeholder="Add a note or comment"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{ alignSelf: "flex-end", textTransform: "none" }}
              onClick={handleAddComment}
            >
              Add
            </Button>
          </Stack>
        )}

        {/* Applied Discount */}
        {appliedDiscount > 0 && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
            sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 0.5 }}
          >
            <Typography variant="body2" color="error.main" fontWeight={600}>
              Discount
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" color="error.main">
                -${appliedDiscount.toFixed(2)}
              </Typography>
              <IconButton size="small" onClick={handleRemoveDiscount}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        )}

        {appliedComment && (
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={1}
            sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 0.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Comment
            </Typography>
            <Typography variant="body2" color="text.primary">
              {appliedComment}
            </Typography>
          </Stack>
        )}

        {/* Tax & Total */}
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography color="text.secondary">
            Tax ({taxRate?.toFixed(2)}%)
          </Typography>
          <Typography>{tax.toFixed(2)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography fontWeight={700}>Total</Typography>
          <Typography fontWeight={700}>{total.toFixed(2)}</Typography>
        </Stack>
      </Box>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        severity={snackSeverity}
      />
    </>
  );
}
