import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Snackbar, useTheme } from "@/components/common";
import { CircularProgress } from "@mui/material";
import type { AppDispatch } from "@/app/store";
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
    saleType: "all",
    status: "all",
    search: "",
    fromDate: "",
    toDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchSalesReport());
  }, [dispatch]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
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

  const filteredRows = React.useMemo(() => {
    const normalize = (value: string) => value.trim().toLowerCase();
    const searchTerm = normalize(appliedFilters.search);
    return reports.filter((sale) => {
      if (appliedFilters.saleType !== "all" && sale.saleType !== appliedFilters.saleType) {
        return false;
      }
      if (appliedFilters.status !== "all" && sale.status !== appliedFilters.status) {
        return false;
      }
      if (appliedFilters.fromDate && sale.createdAt && new Date(sale.createdAt) < new Date(appliedFilters.fromDate)) {
        return false;
      }
      if (appliedFilters.toDate && sale.createdAt && new Date(sale.createdAt) > new Date(appliedFilters.toDate)) {
        return false;
      }
      if (!searchTerm) return true;
      const invoiceMatch = sale.invoiceNumber?.toLowerCase().includes(searchTerm);
      const name = `${sale.customerInformation?.firstName ?? ""} ${sale.customerInformation?.lastName ?? ""}`.toLowerCase();
      const customerMatch = name.includes(searchTerm);
      const phoneMatch = sale.customerInformation?.phone?.toLowerCase().includes(searchTerm);
      return invoiceMatch || customerMatch || phoneMatch;
    });
  }, [reports, appliedFilters]);

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

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
      />

      <ReportTable rows={filteredRows} onDelete={handleDelete} />

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
