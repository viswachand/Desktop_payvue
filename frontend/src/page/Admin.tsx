import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "@/app/store";
import {
  fetchAdminConfig,
  createOrUpdateAdminConfig,
  selectAdminConfig,
  selectAdminLoading,
  selectAdminSuccess,
  selectAdminError,
  resetAdminSuccess,
  clearAdminError,
} from "@/features/admin/adminSlice";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function AdminConfigPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const config = useSelector(selectAdminConfig);
  const loading = useSelector(selectAdminLoading);
  const success = useSelector(selectAdminSuccess);
  const error = useSelector(selectAdminError);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchAdminConfig());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: config?.companyName ?? "",
      companyAddress: config?.companyAddress ?? "",
      companyPhone: config?.companyPhone
        ? formatPhoneNumber(config.companyPhone)
        : "",
      companyEmail: config?.companyEmail ?? "",
      companyFax: config?.companyFax ?? "",
      taxRate: config?.taxRate?.toString() ?? "",
    },
    validationSchema: Yup.object({
      companyEmail: Yup.string().email("Enter a valid email").nullable(),
      taxRate: Yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .nullable(),
    }),
    onSubmit: (values) => {
      const plainPhone = values.companyPhone.replace(/\D/g, "");
      dispatch(
        createOrUpdateAdminConfig({
          ...values,
          companyPhone: plainPhone,
          taxRate: parseFloat(values.taxRate || "0"),
        })
      );
    },
  });

  // Snackbar feedback
  useEffect(() => {
    if (success) {
      setSnack({
        open: true,
        message: "Configuration saved successfully",
        severity: "success",
      });
      dispatch(resetAdminSuccess());
    } else if (error) {
      setSnack({ open: true, message: error, severity: "error" });
      dispatch(clearAdminError());
    }
  }, [success, error, dispatch]);

  const handleReset = () => {
    formik.resetForm();
  };

  if (loading && !config) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Company Configuration
      </Typography>

      {config?.updatedAt && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Last updated on{" "}
          {new Date(config.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your company’s basic information and tax preferences. This
        information will appear on invoices, receipts, and customer documents.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{mb:4}}>
              Company Information
            </Typography>

            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Company Name"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                label="Company Address"
                name="companyAddress"
                value={formik.values.companyAddress}
                onChange={formik.handleChange}
                fullWidth
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Phone"
                    name="companyPhone"
                    value={formik.values.companyPhone}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Email"
                    name="companyEmail"
                    value={formik.values.companyEmail}
                    onChange={formik.handleChange}
                    type="email"
                    fullWidth
                    error={
                      !!formik.errors.companyEmail &&
                      !!formik.touched.companyEmail
                    }
                    helperText={
                      formik.touched.companyEmail &&
                      formik.errors.companyEmail
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Fax (optional)"
                    name="companyFax"
                    value={formik.values.companyFax}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Tax Rate (%)"
                    name="taxRate"
                    value={formik.values.taxRate}
                    onChange={formik.handleChange}
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                    error={!!formik.errors.taxRate && !!formik.touched.taxRate}
                    helperText={formik.touched.taxRate && formik.errors.taxRate}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                  disabled={!formik.dirty}
                >
                  Reset to Defaults
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[50]
                  : theme.palette.background.default,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Why this matters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The company configuration defines the identity and tax details
              printed on invoices and receipts. Keeping this information
              accurate ensures compliance and professional presentation.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
