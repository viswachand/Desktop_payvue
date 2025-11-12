import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Snackbar,
  useTheme,
  CsvDownloadButton,
} from "@/components/common";
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
import type { Sale } from "@payvue/shared/types/sale";
import type { CsvColumn } from "@/components/common/CsvDownloadButton";

const buildDefaultFilters = () => ({
  saleType: "all",
  status: "all",
  search: "",
  fromDate: "",
  toDate: "",
});

export default function SalesReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const reports = useSelector(selectReports);
  const loading = useSelector(selectReportLoading);
  const theme = useTheme();

  const [filters, setFilters] = useState(() => buildDefaultFilters());
  const [appliedFilters, setAppliedFilters] = useState(() => buildDefaultFilters());

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

  const handleResetFilters = () => {
    const defaults = buildDefaultFilters();
    setFilters(defaults);
    setAppliedFilters(defaults);
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

  const filteredRows = useMemo(() => {
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

  const formatInstallments = (sale: Sale) => {
    if (!sale.installments?.length) return "";
    return sale.installments
      .map((inst, index) => {
        const amount = inst.amount ?? 0;
        const method = inst.method ?? "method";
        const paidDate = inst.paidAt
          ? new Date(inst.paidAt).toLocaleDateString("en-US")
          : "";
        return `${index + 1}. ${method}:${amount}${
          paidDate ? `(${paidDate})` : ""
        }`;
      })
      .join(" | ");
  };

  const csvColumns = useMemo<CsvColumn<Sale>[]>(() => {
    return [
      { header: "invoiceNumber", accessor: (sale) => sale.invoiceNumber ?? "" },
      {
        header: "date",
        accessor: (sale) =>
          sale.createdAt
            ? new Date(sale.createdAt).toLocaleDateString("en-US")
            : "",
      },
      {
        header: "customer",
        accessor: (sale) =>
          `${sale.customerInformation?.firstName ?? ""} ${
            sale.customerInformation?.lastName ?? ""
          }`.trim(),
      },
      {
        header: "phone",
        accessor: (sale) => sale.customerInformation?.phone ?? "",
      },
      {
        header: "subtotal",
        accessor: (sale) => sale.subtotal ?? 0,
      },
      {
        header: "discountTotal",
        accessor: (sale) => sale.discountTotal ?? 0,
      },
      {
        header: "paidAmount",
        accessor: (sale) => sale.paidAmount ?? 0,
      },
      {
        header: "status",
        accessor: (sale) => sale.status ?? "",
      },
      {
        header: "installments",
        accessor: (sale) => formatInstallments(sale),
      },
    ];
  }, []);

  const downloadFileName = useMemo(() => {
    const from = appliedFilters.fromDate || "all";
    const to = appliedFilters.toDate || "all";
    return `reports-${from}-${to}`;
  }, [appliedFilters.fromDate, appliedFilters.toDate]);

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
        onReset={handleResetFilters}
        extraActions={
          <CsvDownloadButton
            data={filteredRows as Sale[]}
            columns={csvColumns}
            fileName={downloadFileName}
            label="Download CSV"
            disabled={!filteredRows.length}
          />
        }
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
