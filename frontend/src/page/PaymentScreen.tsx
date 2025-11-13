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

import SalePaymentLayout from "../modules/sales/layout/SalePaymentLayout";
import AmountSummary from "../modules/sales/components/AmountSummary";
import PaymentMethods from "../modules/sales/components/PaymentMethods";
import CustomerCard from "../modules/sales/components/CustomerCard";
import PaymentFooter from "../modules/sales/components/PaymentFooter";

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
import { selectAdminConfig } from "@/features/admin/adminSlice";
import { createSale } from "@/features/sales/saleSlice";
import { calculateSaleTotals } from "@/utils/saleHelpers";
import type { AppDispatch } from "@/app/store";
import type {
  PaymentMethod,
  SaleItemType,
  SaleSignature,
} from "@payvue/shared/types/sale";

export default function PaymentPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const cart = useSelector(selectCartItems);
  const customer = useSelector(selectCustomer);
  const discount = useSelector(selectDiscount);
  const comment = useSelector(selectComment);
  const admin = useSelector(selectAdminConfig);
  const taxRate = admin?.taxRate ?? 8;

  // Local state
  const [installments, setInstallments] = useState<
    { method: PaymentMethod; amount: number }[]
  >([]);
  const [isLayaway, setIsLayaway] = useState(false);
  const [policy, setPolicy] = useState({ title: "", description: "" });
  const [signature, setSignature] = useState<SaleSignature | null>(null);

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
    () => calculateSaleTotals(cart, discount, taxRate),
    [cart, discount, taxRate]
  );

  useEffect(() => {
    if (!cart.length) navigate("/sale/item", { replace: true });
  }, [cart, navigate]);

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
    if (!signature?.imageData)
      return showSnack("Capture the customer's signature before continuing.", "error");

    const saleType = cart.some((i) => i.itemType === "custom")
      ? "custom"
      : cart.some((i) =>
          ["repair", "grill", "service"].includes(i.itemType ?? "")
        )
      ? "service"
      : "inventory";

    const saleItems = cart.map((i: CartItem & { type?: string }) => {
      const resolvedType = (i.itemType ?? (i as any).type ?? "inventory") as SaleItemType;
      const quantity = Number(i.quantity ?? i.qty ?? 1) || 1;
      const taxApplied = i.taxApplied === false ? false : true;
      const lineDiscount = Number(i.discount ?? 0) || 0;
      const costPrice = Number(i.costPrice ?? 0) || 0;

      return {
        type: resolvedType,
        itemId: i.id,
        name: i.itemName ?? (i as any).name ?? "",
        description: i.itemDescription ?? (i as any).description ?? "",
        costPrice,
        quantity,
        discount: lineDiscount,
        taxApplied,
      };
    });

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
      signature: signature ?? undefined,
    };

    try {
      const res = await dispatch(createSale(salePayload)).unwrap();

      if (res) {
        dispatch(clearCart());
        dispatch(clearCustomer());
        dispatch(clearPayment());
        setSignature(null);
        navigate("/success");
      } else {
        showSnack("Failed to create sale. Please try again.", "error");
      }
    } catch (err: any) {
      showSnack(`Failed to create sale: ${err.message ?? err}`, "error");
    }
  };

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

            <PaymentMethods
              totalAmount={total}
              isLayaway={isLayaway}
              onInstallmentsChange={setInstallments}
            />

            {customer ? (
              <CustomerCard />
            ) : (
              <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                No customer selected
              </Typography>
            )}

            <PaymentFooter
              onSelectLayaway={setIsLayaway}
              onSelectPolicy={setPolicy}
              remainingAmount={remaining}
              signature={signature}
              onSignatureChange={setSignature}
            />

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
                  borderRadius: theme.shape.borderRadius,
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

      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        severity={snackSeverity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
