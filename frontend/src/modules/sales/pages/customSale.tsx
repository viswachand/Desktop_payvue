import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
  useTheme,
} from "@/components/common";
import { MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import SaleLayout from "../layout/SaleLayout";
import type { AppDispatch } from "@/app/store";
import { addToCart } from "@/features/cart/cartSlice";

export default function CustomSale() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const formik = useFormik({
    initialValues: {
      itemName: "",
      description: "",
      material: "",
      weight: "",
      goldPrice: "",
      makingCharge: "",
      laborCharge: "",
      deliveryDate: "",
    },
    validationSchema: Yup.object({
      itemName: Yup.string().required("Item name is required"),
      material: Yup.string().required("Material is required"),
      weight: Yup.number().positive().required("Weight is required"),
      goldPrice: Yup.number().positive().required("Gold rate required"),
      deliveryDate: Yup.string().required("Delivery date required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const w = Number(values.weight) || 0;
      const g = Number(values.goldPrice) || 0;
      const m = Number(values.makingCharge) || 0;
      const l = Number(values.laborCharge) || 0;
      const total = w * g + m + l;

      const newCustomItem = {
        id: Date.now().toString(),
        itemType: "custom" as const, 
        itemName: values.itemName,
        itemDescription: values.description,
        material: values.material,
        weight: w,
        goldPrice: g,
        makingCharge: m,
        laborCharge: l,
        costPrice: total,
        qty: 1,
        taxApplied: true,
        deliveryDate: values.deliveryDate,
      };

      dispatch(addToCart(newCustomItem));

      setSnackSeverity("success");
      setSnackMessage("Custom jewelry item added to cart!");
      setSnackOpen(true);
      resetForm();
    },
  });

  // 🧮 Live Total Calculation
  const total = useMemo(() => {
    const w = Number(formik.values.weight) || 0;
    const g = Number(formik.values.goldPrice) || 0;
    const m = Number(formik.values.makingCharge) || 0;
    const l = Number(formik.values.laborCharge) || 0;
    return w * g + m + l;
  }, [formik.values]);

  return (
    <SaleLayout>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            Custom Jewelry Order
          </Typography>

          <Box
            sx={{
              borderRadius: theme.shape.borderRadius,
              p: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={2}>
              {/* 🧾 Item Details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Item Name"
                  placeholder="e.g., Diamond Ring"
                  {...formik.getFieldProps("itemName")}
                  error={formik.touched.itemName && !!formik.errors.itemName}
                  helperText={formik.touched.itemName && formik.errors.itemName}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="Material"
                  {...formik.getFieldProps("material")}
                  error={formik.touched.material && !!formik.errors.material}
                  helperText={formik.touched.material && formik.errors.material}
                  fullWidth
                  size="small"
                >
                  {["Gold", "Silver", "Platinum"].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Weight (g)"
                  type="number"
                  {...formik.getFieldProps("weight")}
                  error={formik.touched.weight && !!formik.errors.weight}
                  helperText={formik.touched.weight && formik.errors.weight}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Gold Rate ($/g)"
                  type="number"
                  {...formik.getFieldProps("goldPrice")}
                  error={formik.touched.goldPrice && !!formik.errors.goldPrice}
                  helperText={formik.touched.goldPrice && formik.errors.goldPrice}
                  placeholder="80"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Making Charge ($)"
                  type="number"
                  {...formik.getFieldProps("makingCharge")}
                  placeholder="0"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Labor Charge ($)"
                  type="number"
                  {...formik.getFieldProps("laborCharge")}
                  placeholder="0"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Delivery Date"
                  type="date"
                  {...formik.getFieldProps("deliveryDate")}
                  error={formik.touched.deliveryDate && !!formik.errors.deliveryDate}
                  helperText={formik.touched.deliveryDate && formik.errors.deliveryDate}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  placeholder="Enter design notes or specifications"
                  {...formik.getFieldProps("description")}
                  fullWidth
                  size="small"
                  sx={{
                    "& textarea": {
                      overflow: "hidden !important",
                      resize: "none !important",
                    },
                  }}
                />
              </Grid>

              {/* 💰 Total */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" fontWeight={700} align="right" sx={{ mt: 1 }}>
                  Total: ${total.toFixed(2)}
                </Typography>
              </Grid>

              {/* 🛒 Add Button */}
              <Box sx={{ width: "100%", mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
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
            </Grid>
          </Box>
        </Box>
      </form>

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
