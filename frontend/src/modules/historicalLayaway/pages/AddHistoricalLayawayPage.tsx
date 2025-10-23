import React, { useState } from "react";
import { Box, Typography, Snackbar, useTheme, Button, Stack } from "@/components/common";
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
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Historical Layaway
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Record legacy layaway details, items, and payment history in one place.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
      </Stack>

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
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          mt: 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.customShadows?.card,
      }}
    >
        <HistoricalLayawayForm onCancel={() => navigate(-1)} />
      </Box>
    </Box>
  );
}
