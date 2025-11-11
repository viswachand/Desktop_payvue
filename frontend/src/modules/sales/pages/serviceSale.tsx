import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  Snackbar,
  TextField,
  Stack,
} from "@/components/common";
import SaleLayout from "../layout/SaleLayout";
import type { AppDispatch } from "@/app/store";
import { addToCart, updateCartItem, CartItem } from "@/features/cart/cartSlice";
import { useLocation, useNavigate } from "react-router-dom";

type ServiceType = "repair" | "grill";

export default function ServiceSale() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [amount, setAmount] = useState("");
  const [receiveDate, setReceiveDate] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const state = location.state as { editItem?: CartItem } | null;
    const incoming = state?.editItem;

    if (incoming) {
      const normalizedType = (incoming.itemType ?? "").toLowerCase();
      if (normalizedType === "repair" || normalizedType === "grill") {
        setEditingItem(incoming);
        setServiceType(normalizedType as ServiceType);
        setAmount(
          incoming.costPrice !== undefined ? String(incoming.costPrice) : ""
        );
        setReceiveDate((incoming as any).receiveDate ?? "");
        return;
      }
    }

    setEditingItem(null);
  }, [location.state]);

  const isEditing = Boolean(editingItem);

  const handleAddService = () => {
    const numericAmount = Number(amount);

    if (!serviceType || !numericAmount || numericAmount <= 0 || !receiveDate) {
      setSnackSeverity("warning");
      setSnackMessage("Please fill all fields (Type, Amount, Receive Date)");
      setSnackOpen(true);
      return;
    }

    if (isEditing && editingItem) {
      const updatedService = {
        ...editingItem,
        itemType: serviceType,
        itemName:
          serviceType === "repair"
            ? "Repair Service"
            : serviceType === "grill"
            ? "Grill Service"
            : editingItem.itemName,
        itemDescription: `Service Type: ${serviceType}, Receive Date: ${receiveDate}`,
        costPrice: numericAmount,
        qty: editingItem.qty ?? 1,
        taxApplied: true,
      } as CartItem;

      (updatedService as any).receiveDate = receiveDate;

      dispatch(updateCartItem(updatedService));
      setSnackSeverity("success");
      setSnackMessage("Service item updated in cart");
      setSnackOpen(true);

      navigate("/sale/service", { replace: true, state: undefined });
      setEditingItem(null);
      setServiceType("");
      setAmount("");
      setReceiveDate("");
      return;
    }

    const newService = {
      id: Date.now().toString(),
      itemName:
        serviceType === "repair"
          ? "Repair Service"
          : serviceType === "grill"
          ? "Grill Service"
          : "Service",
      itemDescription: `Service Type: ${serviceType}, Receive Date: ${receiveDate}`,
      costPrice: numericAmount,
      qty: 1,
      itemType: serviceType,
      taxApplied: true,
    } as CartItem;

    (newService as any).receiveDate = receiveDate;

    dispatch(addToCart(newService));

    setServiceType("");
    setAmount("");
    setReceiveDate("");

    setSnackSeverity("success");
    setSnackMessage(
      `${serviceType === "repair" ? "Repair" : "Grill"} service added to cart`
    );
    setSnackOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setAmount(value);
  };

  return (
    <SaleLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEditing ? "Edit Service Item" : "Service Sale"}
        </Typography>

        <Box
          sx={{
            borderRadius: theme.shape.borderRadius,
            p: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Service Type
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 1,
                }}
              >
                {(["repair", "grill"] as ServiceType[]).map((type) => (
                  <Button
                    key={type}
                    variant={serviceType === type ? "contained" : "outlined"}
                    onClick={() => setServiceType(type)}
                    color="primary"
                    sx={{
                      width: "100%",
                      textTransform: "capitalize",
                      fontWeight: 500,
                      borderRadius: theme.shape.borderRadius,
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Amount ($)"
                name="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    inputMode: "decimal",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Receive Date"
                name="receiveDate"
                type="date"
                value={receiveDate}
                onChange={(e) => setReceiveDate(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddService}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                px: 3,
                py: 1.2,
              }}
            >
              {isEditing ? "Update Cart Item" : "+ Add to Cart"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        severity={snackSeverity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </SaleLayout>
  );
}
