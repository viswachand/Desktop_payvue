import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  Snackbar,
  TextField,
} from "@/components/common";

import SaleLayout from "../layout/SaleLayout";
import type { AppDispatch } from "@/app/store";
import { addToCart } from "@/features/cart/cartSlice";

// -----------------------------------------------------
// TYPES
// -----------------------------------------------------
type ServiceType = "repair" | "grill";

// -----------------------------------------------------
// COMPONENT
// -----------------------------------------------------
export default function ServiceSale() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Local state
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [amount, setAmount] = useState<string>("");
  const [receiveDate, setReceiveDate] = useState<string>("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  // -----------------------------------------------------
  // HANDLER
  // -----------------------------------------------------
  const handleAddService = () => {
    const numericAmount = Number(amount);

    if (!serviceType || !numericAmount || numericAmount <= 0 || !receiveDate) {
      setSnackSeverity("warning");
      setSnackMessage("Please fill all fields (Type, Amount, Receive Date)");
      setSnackOpen(true);
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
      taxApplied: false,
      receiveDate,
    };

    dispatch(addToCart(newService));

    // Reset form
    setServiceType("");
    setAmount("");
    setReceiveDate("");

    setSnackSeverity("success");
    setSnackMessage(
      `${serviceType === "repair" ? "Repair" : "Grill"} service added to cart`
    );
    setSnackOpen(true);
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <SaleLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 2,
        }}
      >
        {/* 🧾 Header */}
        <Typography variant="h5" fontWeight={700}>
          Service Sale
        </Typography>

        {/* 🧩 Form */}
        <Box
          sx={{
            borderRadius: theme.shape.borderRadius,
            p: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={2.5}>
            {/* Service Type */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Service Type
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt:-1.8}}>
                {(["repair", "grill"] as ServiceType[]).map((type) => (
                  <Button
                    key={type}
                    variant={serviceType === type ? "contained" : "outlined"}
                    onClick={() => setServiceType(type)}
                    color="primary"
                    fullWidth
                    sx={{
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

            {/* Amount */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Amount ($)"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                fullWidth
                size="small"
              />
            </Grid>

            {/* Receive Date */}
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

          {/* ➕ Add Button */}
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
              + Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ✅ Snackbar */}
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
