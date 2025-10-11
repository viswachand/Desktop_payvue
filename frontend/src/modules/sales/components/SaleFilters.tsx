import { TextField, MenuItem, Button } from "@mui/material";
import { Grid } from "@mui/material"; // or import { Grid } from "@/components/common" if you wrapped MUI Grid
import { useState } from "react";

interface SaleFiltersProps {
  onFilterChange: (filters: {
    saleType: string;
    status: string;
    search: string;
  }) => void;
}

export default function SaleFilters({ onFilterChange }: SaleFiltersProps) {
  const [filters, setFilters] = useState({
    saleType: "",
    status: "",
    search: "",
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Grid container spacing={1.5} sx={{ mb: 2 }}>
      {/* Sale Type */}
      <Grid size={{ xs: 6, md: 2 }}>
        <TextField
          select
          label="Sale Type"
          value={filters.saleType}
          onChange={(e) => handleChange("saleType", e.target.value)}
          fullWidth
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="inventory">Inventory</MenuItem>
          <MenuItem value="service">Service</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </TextField>
      </Grid>

      {/* Status */}
      <Grid size={{ xs: 6, md: 2 }}>
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          fullWidth
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
        </TextField>
      </Grid>

      {/* Search */}
      <Grid size={{ xs: 6, md: 2 }}>
        <TextField
          placeholder="Search invoice, name, or phone..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      {/* Apply Button */}
      <Grid size={{ xs: 6, md: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onFilterChange(filters)}
          fullWidth
          sx={{ height: 40, fontWeight: 600, textTransform: "none" , borderRadius:1}}
        >
          Apply
        </Button>
      </Grid>
    </Grid>
  );
}
