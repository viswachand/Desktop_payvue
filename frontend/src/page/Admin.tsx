import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  useTheme,
} from "@/components/common";
import { CircularProgress } from "@mui/material";
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

/**
 * Admin configuration form for company settings and tax preferences.
 * Adapts to light/dark mode and handles form validation + persistence.
 */
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

  // Fetch existing config on mount
  useEffect(() => {
    dispatch(fetchAdminConfig());
  }, [dispatch]);

  // Formik configuration
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

  // Snackbar management
  useEffect(() => {
    if (success) {
      setSnack({
        open: true,
        message: "Configuration saved successfully",
        severity: "success",
      });
      dispatch(resetAdminSuccess());
    } else if (error) {
      setSnack({
        open: true,
        message: error,
        severity: "error",
      });
      dispatch(clearAdminError());
    }
  }, [success, error, dispatch]);

  // Handle reset form
  const handleReset = () => {
    formik.resetForm();
  };

  // Handle phone formatting with +1 prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    formik.setFieldValue("companyPhone", formatted);
  };

  if (loading && !config) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const paperBg =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.background.default;
  const infoBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.background.paper;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom component="div">
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
        information appears on invoices, receipts, and customer documents.
      </Typography>

      <Grid spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: paperBg,
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 4 }}
            >
              Company Information
            </Typography>

            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                id="companyName"
                name="companyName"
                label="Company Name"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                fullWidth
                autoComplete="organization"
              />

              <TextField
                id="companyAddress"
                name="companyAddress"
                label="Company Address"
                value={formik.values.companyAddress}
                onChange={formik.handleChange}
                fullWidth
                autoComplete="street-address"
              />

              <Grid spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="companyPhone"
                    name="companyPhone"
                    label="Phone"
                    value={formik.values.companyPhone}
                    onChange={handlePhoneChange}
                    fullWidth
                    autoComplete="tel"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="companyEmail"
                    name="companyEmail"
                    label="Email"
                    type="email"
                    value={formik.values.companyEmail}
                    onChange={formik.handleChange}
                    fullWidth
                    autoComplete="email"
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

              <Grid spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="companyFax"
                    name="companyFax"
                    label="Fax (optional)"
                    value={formik.values.companyFax}
                    onChange={formik.handleChange}
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="taxRate"
                    name="taxRate"
                    label="Tax Rate (%)"
                    type="number"
                    value={formik.values.taxRate}
                    onChange={formik.handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                    error={
                      !!formik.errors.taxRate && !!formik.touched.taxRate
                    }
                    helperText={
                      formik.touched.taxRate && formik.errors.taxRate
                    }
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
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

        {/* Right Column (Info Panel) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: infoBg,
              height: "30%",
            }}
          >
            <Typography
              variant="subtitle1"
              component="div"
              fontWeight={600}
              gutterBottom
            >
              Why this matters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This configuration defines the identity and tax details printed on
              invoices and receipts. Keeping it accurate ensures compliance and
              a professional presentation.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snack.open}
        severity={snack.severity}
        message={snack.message}
        onClose={() => setSnack({ ...snack, open: false })}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
