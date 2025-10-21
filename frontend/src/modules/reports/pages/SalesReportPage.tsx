import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Snackbar, useTheme } from "@/components/common";
import { CircularProgress } from "@mui/material";
import type { AppDispatch } from "@/app/store";
import type { Sale } from "@payvue/shared/types/sale";
import {
  fetchSalesReport,
  deleteSaleFromReport,
  selectReports,
  selectReportLoading,
} from "@/features/reports/reportSlice";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";

export default function SalesReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const reports = useSelector(selectReports);
  const loading = useSelector(selectReportLoading);
  const theme = useTheme();

  const [filters, setFilters] = useState({
    saleType: "",
    status: "",
    search: "",
    fromDate: "",
    toDate: "",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchSalesReport());
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchSalesReport(filters));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSaleFromReport(id)).unwrap();
      setSnack({
        open: true,
        message: "Sale deleted successfully",
        severity: "success",
      });
    } catch (err: any) {
      setSnack({
        open: true,
        message: err.message ?? "Failed to delete sale",
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
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Sales Reports
      </Typography>

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
      />

      {/* Table */}
      <ReportTable rows={reports} onDelete={handleDelete} />

      {/* Snackbar */}
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
