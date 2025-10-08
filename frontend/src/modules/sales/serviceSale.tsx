import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
  Snackbar,
} from "@/components/common";
import SaleLayout from "./layout/SaleLayout";
import CartPanel from "./CartPanel";
import type { AppDispatch } from "@/app/store";
import { addToCart } from "@/features/cart/cartSlice";

// -----------------------------------------------------
// TYPES
// -----------------------------------------------------
type ServiceType = "Repair" | "Grill";

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
  // HANDLERS
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
      itemName: serviceType, // Display name
      costPrice: numericAmount,
      quantity: 1,
      type: serviceType, // Explicit service type
      taxApplied: false,
    };

    dispatch(addToCart(newService));

    // Reset form
    setServiceType("");
    setAmount("");
    setReceiveDate("");
    setSnackSeverity("success");
    setSnackMessage(`${serviceType} service added to cart`);
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

        {/* 🧩 Service Form */}
        <Box
          sx={{
            borderRadius: 2,
            p: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "light"
                ? "0px 2px 6px rgba(0,0,0,0.08)"
                : "0px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          <Grid container spacing={2}>
            {/* Service Type */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Service Type
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["Repair", "Grill"].map((type) => (
                  <Button
                    key={type}
                    variant={serviceType === type ? "contained" : "outlined"}
                    onClick={() => setServiceType(type as ServiceType)}
                    color="primary"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 1.5,
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Amount (no increment/decrement) */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Amount ($)
              </Typography>
              <TextField
                type="text"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) setAmount(val); // allow only digits and decimals
                }}
                placeholder="0.00"
                fullWidth
                size="small"
                inputProps={{
                  inputMode: "decimal", // opens numeric keyboard on mobile
                  style: { textAlign: "right" },
                }}
                sx={{
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>

            {/* Receive Date */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Receive Date
              </Typography>
              <TextField
                type="date"
                value={receiveDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReceiveDate(e.target.value)
                }
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
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
              + Add Service
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
