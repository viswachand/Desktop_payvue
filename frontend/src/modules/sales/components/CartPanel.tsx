import { useMemo, useState } from "react";
import { Box, Typography, Button, Snackbar } from "@/components/common";
import { IconButton, Stack, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCustomerDialog from "./AddCustomerDialog";
import CartSummary from "./CartSummary";
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
import { selectAdminConfig } from "@/features/admin/adminSlice";

export default function CartPanel() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const cart = useSelector(selectCartItems);
  const customer = useSelector(selectCustomer);
  const discount = useSelector(selectDiscount);
  const comment = useSelector(selectComment);
  const admin = useSelector(selectAdminConfig);
  const taxRate = admin?.taxRate ?? 8; // fallback default

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "error" | "warning" | "success"
  >("error");

  // Customer Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogCustomer, setDialogCustomer] = useState<Customer | null>(null);

  // ✅ Correct totals (with dynamic tax)
  const { subtotal, tax, total } = useMemo(
    () => calculateSaleTotals(cart, discount, taxRate),
    [cart, discount, taxRate]
  );

  // Snackbar helper
  const showSnack = (
    message: string,
    severity: "error" | "warning" | "success"
  ) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  // 🧍 Customer actions
  const handleSaveCustomer = (data: Customer) => {
    dispatch(setCustomer(data));
    setDialogCustomer(null);
    setOpenDialog(false);
  };

  const handleAddCustomer = () => {
    setDialogCustomer(null);
    setOpenDialog(true);
  };

  const handleEditCustomer = () => {
    if (!customer) return;
    setDialogCustomer(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogCustomer(null);
  };

  const handleEditCartItem = (item: CartItem) => {
    const itemType = (item.itemType ?? "").toLowerCase();

    if (itemType === "custom") {
      navigate("/sale/custom", { state: { editItem: item } });
      return;
    }

    if (itemType === "repair" || itemType === "grill") {
      navigate("/sale/service", { state: { editItem: item } });
      return;
    }

    showSnack("Editing is available only for custom or service items.", "warning");
  };

  const handleRemoveCustomer = () => {
    dispatch(clearCustomer());
  };

  // 🛒 Cart actions
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    showSnack("Item removed from cart", "warning");
  };

  // 💳 Payment validation
  const handlePayment = () => {
    if (!customer) {
      showSnack("Please add a customer before proceeding.", "warning");
      return;
    }

    if (cart.length < 1) {
      showSnack("Add at least one item to the cart before paying.", "warning");
      return;
    }

    if (total <= 0) {
      showSnack("Cart total is invalid. Please review your items.", "warning");
      return;
    }

    navigate("/payment");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        flex: 1,
        p: 2,
        borderRadius: theme.shape.borderRadius,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.customShadows.card
      }}
    >
      {!customer ? (
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddCustomer}
          sx={{
            mb: 2,
            textTransform: "none",
            borderRadius: theme.shape.borderRadius,
            fontWeight: 500,
            border: `1px solid ${theme.palette.primary}`,
            boxShadow:theme.customShadows.popover,
            color:theme.palette.primary.main,
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

            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
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

            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                disableRipple
                onClick={handleEditCustomer}
                sx={{
                  "&:hover": {
                    background: "transparent",
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>

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
            </Stack>
          </Box>

          <Box
            sx={{ mb: 2, borderBottom: `1px solid ${theme.palette.grey[300]}` }}
          />
        </>
      )}

      {/* 🛍️ Cart Items */}
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

                <Typography variant="caption" color="text.secondary">
                  Type:{" "}
                  {item.itemType
                    ? item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)
                    : "—"}
                </Typography>
              </Box>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography fontWeight={500}>
                  ${(item.costPrice * item.qty).toFixed(2)}
                </Typography>
                {["custom", "repair", "grill"].includes(
                  (item.itemType ?? "").toLowerCase()
                ) && (
                  <IconButton
                    size="small"
                    disableRipple
                    onClick={() => handleEditCartItem(item)}
                    sx={{
                      "&:hover": {
                        background: "transparent",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
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

      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        taxRate={taxRate}
        discountValue={discount}
        commentValue={comment}
        onDiscountChange={(value) => dispatch(setDiscount(Number(value)))}
        onCommentChange={(value) => dispatch(setComment(value))}
      />

      {/* 💳 Payment Button */}
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

      {/* 🧍 Customer Dialog */}
      <AddCustomerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveCustomer}
        customer={dialogCustomer ?? undefined}
      />

      {/* 🔔 Snackbar */}
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
