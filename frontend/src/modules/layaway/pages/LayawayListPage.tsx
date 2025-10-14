import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Snackbar,
  Grid,
  TextField,
  useTheme,
} from "@/components/common";
import { MenuItem, InputAdornment, CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  fetchLayaways,
  selectLayaways,
  selectLayawayLoading,
  selectLayawayError,
  clearLayawayError,
} from "@/features/layaway/layawaySlice";
import type { AppDispatch } from "@/app/store";

import LayawayTable from "../components/LayawayTable";

export default function LayawayListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const layaways = useSelector(selectLayaways);
  const loading = useSelector(selectLayawayLoading);
  const error = useSelector(selectLayawayError);

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 🚀 Fetch on mount
  useEffect(() => {
    dispatch(fetchLayaways());
  }, [dispatch]);

const filteredLayaways = useMemo(() => {
  return layaways.filter((layaway) => {
    const balance = Number(layaway.balanceAmount ?? 0);

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && balance > 0) ||
      (filters.status === "completed" && balance === 0);

    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      layaway.invoiceNumber?.toLowerCase().includes(searchTerm) ||
      layaway.customerInformation?.firstName
        ?.toLowerCase()
        .includes(searchTerm) ||
      layaway.customerInformation?.phone
        ?.toLowerCase()
        .includes(searchTerm);

    return matchesStatus && matchesSearch;
  });
}, [layaways, filters]);


  const handleCloseError = () => dispatch(clearLayawayError());

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        p: 5,
        backgroundColor: theme.palette.background.default,
      }}
    >

      <Typography variant="h5" fontWeight={700} gutterBottom>
        Layaway Management
      </Typography>

      <Snackbar
        open={!!error || snack.open}
        autoHideDuration={4000}
        onClose={() => {
          handleCloseError();
          setSnack({ ...snack, open: false });
        }}
        message={error || snack.message}
        severity={(snack.severity as any) || "error"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />

      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by invoice or customer"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            sx={{ width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.grey[400] }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            size="small"
            sx={{ flex: "1 1 200px", minWidth: 180 }}
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid container>
        <Grid size={{ xs: 12 }}>
          <LayawayTable layaways={filteredLayaways} />
        </Grid>
      </Grid>
    </Box>
  );
}
