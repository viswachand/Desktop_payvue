import { useMemo, useState } from "react";
import { Box, Typography, Button, Snackbar } from "@/components/common";
import { IconButton, Stack, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCustomerDialog from "./components/AddCustomerDialog";
import CartSummary from "./components/CartSummary";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  removeFromCart,
  CartItem,
} from "@/features/cart/cartSlice";
import {
  selectCustomer,
  setCustomer,
  clearCustomer,
} from "@/features/customers/customerSlice";
import {
  selectDiscount,
  selectComment,
  setDiscount,
  setComment,
} from "@/features/payments/paymentSlice";
import type { AppDispatch } from "@/app/store";
import { Customer } from "@payvue/shared/types/customer";
import { calculateSaleTotals } from "@/utils/saleHelpers";
import { Height } from "@mui/icons-material";

export default function CartPanel() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const cart = useSelector(selectCartItems);
  const customer = useSelector(selectCustomer);
  const discount = useSelector(selectDiscount);
  const comment = useSelector(selectComment);

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "error" | "warning" | "success"
  >("error");

  const [openDialog, setOpenDialog] = useState(false);

  // Centralized sale calculations
  const { subtotal, tax, total } = useMemo(
    () => calculateSaleTotals(cart, discount),
    [cart, discount]
  );

  // Snackbar helper
  const showSnack = (message: string, severity: "error" | "warning" | "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  // Customer actions
  const handleSaveCustomer = (data: Customer) => {
    dispatch(setCustomer(data));
    setOpenDialog(false);
  };

  const handleRemoveCustomer = () => {
    dispatch(clearCustomer());
  };

  // Cart actions
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    showSnack("Item removed from cart", "warning");
  };

  // Payment validation
  const handlePayment = () => {
    if (!customer) {
      showSnack("Please add a customer before proceeding.", "error");
      return;
    }

    if (cart.length < 1) {
      showSnack("Add at least one item to the cart before paying.", "error");
      return;
    }

    if (total <= 0) {
      showSnack("Cart total is invalid. Please review your items.", "warning");
      return;
    }

    navigate("/sale/item/payment");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        flex: 1,
        p: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Customer Section */}
      {!customer ? (
        <Button
          variant="outlined"
          size="small"
          onClick={() => setOpenDialog(true)}
          sx={{
            mb: 2,
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
            borderColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[400]
                : theme.palette.grey[300],
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800]
                : theme.palette.text.primary,
            "&:hover": { borderColor: theme.palette.primary.main },
          }}
        >
          + Add a Customer
        </Button>
      ) : (
        <>
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.background.paper
                  : theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 1px 3px rgba(0,0,0,0.06)"
                  : "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.2,
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
              >
                {customer.firstName[0]?.toUpperCase()}
              </Box>

              <Box>
                <Typography fontWeight={600}>
                  {customer.firstName} {customer.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.phone}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              size="small"
              disableRipple
              onClick={handleRemoveCustomer}
              sx={{
                "&:hover": {
                  background: "transparent",
                  color: theme.palette.error.main,
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2, borderBottom: `1px solid ${theme.palette.grey[300]}` }} />
        </>
      )}

      {/* Cart Items */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {cart.length > 0 ? (
          cart.map((item: CartItem) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box>
                <Typography fontWeight={600}>{item.itemName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {item.qty}
                </Typography>
              </Box>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography fontWeight={500}>
                  ${(item.costPrice ? item.costPrice : 0 * item.qty).toFixed(2)}
                </Typography>
                <IconButton
                  size="small"
                  disableRipple
                  onClick={() => item.id && handleRemoveItem(item.id)}
                  sx={{
                    "&:hover": {
                      background: "transparent",
                      color: "error.main",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            Your cart is empty.
          </Typography>
        )}
      </Box>

      {/* Summary Section */}
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        onDiscountChange={(value) => dispatch(setDiscount(Number(value)))}
        onCommentChange={(value) => dispatch(setComment(value))}
      />

      {/* Payment Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handlePayment}
        fullWidth
        sx={{
          py: 1.5,
          px: 2,
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: 1,
          textTransform: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={600}>Pay</Typography>
        <Typography fontWeight={700}>${total.toFixed(2)}</Typography>
      </Button>

      {/* Customer Dialog */}
      <AddCustomerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCustomer}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        severity={snackSeverity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
