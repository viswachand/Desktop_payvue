import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  useTheme,
} from "@/components/common";

import SalePaymentLayout from "./layout/SalePaymentLayout";
import AmountSummary from "./components/AmountSummary";
import PaymentMethods from "./components/PaymentMethods";
import CustomerCard from "./components/CustomerCard";
import PaymentFooter from "./components/PaymentFooter";

import {
  selectCartItems,
  clearCart,
  CartItem,
} from "@/features/cart/cartSlice";
import {
  selectCustomer,
  clearCustomer,
} from "@/features/customers/customerSlice";
import {
  selectDiscount,
  selectComment,
  clearPayment,
} from "@/features/payments/paymentSlice";
import { createSale } from "@/features/sales/saleSlice";
import { calculateSaleTotals } from "@/utils/saleHelpers";
import type { AppDispatch } from "@/app/store";
import type { PaymentMethod, SaleItemType } from "@payvue/shared/types/sale";

export default function PaymentPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const cart = useSelector(selectCartItems);
  const customer = useSelector(selectCustomer);
  const discount = useSelector(selectDiscount);
  const comment = useSelector(selectComment);

  // Local state
  const [installments, setInstallments] = useState<
    { method: PaymentMethod; amount: number }[]
  >([]);
  const [isLayaway, setIsLayaway] = useState(false);
  const [policy, setPolicy] = useState({ title: "", description: "" });

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">(
    "success"
  );

  const showSnack = useCallback((msg: string, type: "success" | "error") => {
    setSnackMessage(msg);
    setSnackSeverity(type);
    setSnackOpen(true);
  }, []);

  // Totals
  const { subtotal, tax, total } = useMemo(
    () => calculateSaleTotals(cart, discount),
    [cart, discount]
  );

  // Redirect if empty cart
  useEffect(() => {
    if (!cart.length) navigate("/sale/item", { replace: true });
  }, [cart, navigate]);

  // 🧾 Handle Pay
  const handlePay = async () => {
    if (!customer)
      return showSnack("Select a customer before proceeding.", "error");
    if (!cart.length)
      return showSnack("Add at least one item before checkout.", "error");
    if (!policy.title)
      return showSnack("Select a sale policy before proceeding.", "error");

    const totalPaid = installments.reduce((s, i) => s + i.amount, 0);
    if (!isLayaway && totalPaid < total)
      return showSnack("Full payment is required before confirming.", "error");
    if (!installments.length)
      return showSnack("Add at least one payment method.", "error");

    const saleType = cart.some((i) => i.itemType === "custom")
      ? "custom"
      : cart.some((i) =>
          ["repair", "grill", "service"].includes(i.itemType ?? "")
        )
      ? "service"
      : "inventory";

    const saleItems = cart.map((i: CartItem & { type?: string }) => ({
      type: (i.itemType ?? "inventory") as SaleItemType,
      itemId: i.id,
      name: i.itemName ?? i.itemName,
      costPrice: i.costPrice,
      quantity: i.quantity ?? i.qty ?? 1,
      taxApplied:
        ((i.type ?? "inventory") as SaleItemType) === "inventory" ||
        ((i.type ?? "inventory") as SaleItemType) === "custom",
    }));

    // 📦 Final payload
    const salePayload = {
      saleType,
      customerInformation: customer,
      items: saleItems,
      discountTotal: discount || 0,
      installments,
      policyTitle: policy.title,
      policyDescription: policy.description || "No description",
      isLayaway,
      isRefund: false,
      comment,
    };

    try {
      const res = await dispatch(createSale(salePayload)).unwrap();

      if (res) {
        dispatch(clearCart());
        dispatch(clearCustomer());
        dispatch(clearPayment());
        navigate("/success");
      } else {
        showSnack("Failed to create sale. Please try again.", "error");
      }
    } catch (err: any) {
      showSnack(`Failed to create sale: ${err.message ?? err}`, "error");
    }
  };

  // Derived
  const totalItems = cart.reduce((s: number, i: CartItem) => s + i.qty, 0);
  const totalPaid = installments.reduce((s, i) => s + i.amount, 0);
  const remaining = Math.max(total - totalPaid, 0);

  return (
    <>
      <SalePaymentLayout
        left={
          <Box sx={{ p: 2 }}>
            <AmountSummary />
          </Box>
        }
        right={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 💳 Payment Methods */}
            <PaymentMethods
              totalAmount={total}
              isLayaway={isLayaway}
              onInstallmentsChange={setInstallments}
            />

            {/* 👤 Customer */}
            {customer ? (
              <CustomerCard />
            ) : (
              <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                No customer selected
              </Typography>
            )}

            {/* ⚙️ Policy + Layaway */}
            <PaymentFooter
              onSelectLayaway={setIsLayaway}
              onSelectPolicy={setPolicy}
            />

            {/* 💰 Pay Button */}
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePay}
                disabled={
                  !customer ||
                  !cart.length ||
                  (!isLayaway && remaining !== 0) ||
                  (isLayaway && totalPaid === 0)
                }
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 1.5,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 2px 6px rgba(0,0,0,0.1)"
                      : "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                {isLayaway
                  ? `Confirm Layaway $${totalPaid.toFixed(
                      2
                    )} / $${total.toFixed(2)}`
                  : `Pay $${total.toFixed(2)} (${totalItems} item${
                      totalItems !== 1 ? "s" : ""
                    })`}
              </Button>
            </Box>
          </Box>
        }
      />

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        severity={snackSeverity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
}
