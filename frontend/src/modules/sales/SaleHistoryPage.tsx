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
  fetchSales,
  refundSale,
  selectSales,
  selectSaleLoading,
} from "@/features/sales/saleSlice";
import type { AppDispatch } from "@/app/store";
import SaleHistoryTable from "./components/SaleHistoryTable";
import SaleReceiptDialog from "./components/SaleReceiptDialog";

export default function SaleHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const sales = useSelector(selectSales);
  const loading = useSelector(selectSaleLoading);
  const theme = useTheme();

  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // ✅ Default filter values
  const [filters, setFilters] = useState({
    saleType: "all",
    status: "all",
    search: "",
  });

  // 🔄 Fetch sales on mount
  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  // 🔍 Filtered sales (client-side)
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesType =
        filters.saleType === "all" || sale.saleType === filters.saleType;
      const matchesStatus =
        filters.status === "all" || sale.status === filters.status;
      const matchesSearch =
        !filters.search ||
        sale.invoiceNumber
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        sale.customerInformation.firstName
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        sale.customerInformation.phone
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [sales, filters]);

  const handleRefund = async (saleId: string) => {
    try {
      await dispatch(refundSale(saleId)).unwrap();
      setSnack({
        open: true,
        message: "Sale refunded successfully",
        severity: "success",
      });
    } catch (err: any) {
      setSnack({
        open: true,
        message: err.message ?? "Refund failed",
        severity: "error",
      });
    }
  };

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
        Sale History
      </Typography>

      {/* 🔍 Filter Bar */}
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
        {/* 🔍 Search Box (Left) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
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

        {/* 🔽 Filters (Right Side) */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* 🧾 Sale Type */}
          <TextField
            select
            size="small"
            sx={{ flex: "1 1 200px", minWidth: 120 }}
            value={filters.saleType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, saleType: e.target.value }))
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="inventory">Inventory</MenuItem>
            <MenuItem value="service">Service</MenuItem>
          </TextField>

          {/* 🧾 Status */}
          <TextField
            select
            size="small"
            sx={{ flex: "1 1 200px", minWidth: 120 }}
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* 🧾 Table */}
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <SaleHistoryTable 
            sales={filteredSales}
            onView={(sale) => setSelectedSale(sale)}
            onPrint={(sale) => window.print()}
            onRefund={handleRefund}
          />
        </Grid>
      </Grid>

      {/* 🧾 Receipt Dialog */}
      <SaleReceiptDialog
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />

      {/* ✅ Snackbar */}
      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
        severity={snack.severity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
