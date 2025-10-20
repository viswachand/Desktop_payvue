import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Snackbar,
  useTheme,
} from "@/components/common";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HistoricalLayawayForm from "../components/HistoricalLayawayForm";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLayawayLoading,
  selectLayawayError,
  clearLayawayError,
} from "@/features/layaway/layawaySlice";

export default function AddHistoricalLayawayPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectLayawayLoading);
  const error = useSelector(selectLayawayError);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleCloseSnack = () => {
    setSnack((s) => ({ ...s, open: false }));
    if (error) dispatch(clearLayawayError());
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 5,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Historical Layaway Management
      </Typography>

      <Snackbar
        open={Boolean(error) || snack.open}
        onClose={handleCloseSnack}
        message={error || snack.message}
        severity={error ? "error" : snack.severity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />

      <Box
        sx={{
          p: 3,
          mt: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderLeft: `1px solid ${theme.palette.divider}`,
          borderRight: `1px solid ${theme.palette.divider}`,
          borderBottom: "none",
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <HistoricalLayawayForm
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
