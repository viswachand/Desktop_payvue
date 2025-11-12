import { Box, Button, TextField, Select, useTheme } from "@/components/common";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState, ReactNode } from "react";

interface ReportFiltersProps {
  filters: {
    saleType: string;
    status: string;
    search: string;
    fromDate: string;
    toDate: string;
  };
  onChange: (filters: ReportFiltersProps["filters"]) => void;
  onApply: () => void;
  onReset?: () => void;
  extraActions?: ReactNode;
}

export default function ReportFilters({
  filters,
  onChange,
  onApply,
  onReset,
  extraActions,
}: ReportFiltersProps) {
  const theme = useTheme();
  const [dateError, setDateError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    if (key === "fromDate" || key === "toDate") {
      const from = key === "fromDate" ? value : updated.fromDate;
      const to = key === "toDate" ? value : updated.toDate;
      if (from && to && new Date(from) > new Date(to)) {
        setDateError("From date cannot be later than To date");
      } else {
        setDateError(null);
      }
    }
    onChange(updated);
  };

  const handleReset = () => {
    setDateError(null);
    if (onReset) {
      onReset();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        alignItems: "flex-end",
      }}
    >
      <TextField
        name="search"
        placeholder="Search customer or invoice..."
        size="small"
        sx={{ flex: "1 1 240px", minWidth: 200 }}
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
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

      <TextField
        name="fromDate"
        placeholder="From Date"
        type="date"
        size="small"
        value={filters.fromDate}
        onChange={(e) => handleChange("fromDate", e.target.value)}
        slotProps={{
          inputLabel: { shrink: false },
        }}
        sx={{ width: 180 }}
        error={Boolean(dateError)}
        helperText={dateError ? "Invalid date range" : ""}
      />

      <TextField
        name="toDate"
        placeholder="To Date"
        type="date"
        size="small"
        sx={{ width: 180 }}
        value={filters.toDate}
        onChange={(e) => handleChange("toDate", e.target.value)}
        slotProps={{
          inputLabel: { shrink: false },
        }}
        error={Boolean(dateError)}
        helperText={dateError ? "Invalid date range" : ""}
      />

      <Select
        value={filters.saleType || "all"}
        onChange={(e) => handleChange("saleType", e.target.value)}
        options={[
          { value: "all", label: "All Types" },
          { value: "inventory", label: "Inventory" },
          { value: "service", label: "Service" },
          { value: "custom", label: "Custom" },
        ]}
        placeholder="All Types"
        minWidth={160}
      />

      <Select
        value={filters.status || "all"}
        onChange={(e) => handleChange("status", e.target.value)}
        options={[
          { value: "all", label: "All Status" },
          { value: "paid", label: "Paid" },
          { value: "installment", label: "Installments" },
          { value: "refunded", label: "Refunded" },
        ]}
        placeholder="All Status"
        minWidth={160}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          ml: "auto",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            textTransform: "none",
            height: 40,
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={onApply}
          disabled={Boolean(dateError)}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            textTransform: "none",
            height: 40,
          }}
        >
          Apply
        </Button>
        {extraActions}
      </Box>
    </Box>
  );
}
