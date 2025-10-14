import { useState } from "react";
import { Tabs, Tab, InputAdornment } from "@mui/material";
import { Box, TextField, useTheme } from "@/components/common";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface LayawayFiltersProps {
  onSearch?: (query: string) => void;
  onStatusChange?: (status: string) => void;
}

export default function LayawayFilters({
  onSearch,
  onStatusChange,
}: LayawayFiltersProps) {
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch?.(value);
  };

  const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
    onStatusChange?.(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
      gap={2}
      sx={{
        p: 2,
        boxShadow: 1,
      }}
    >
      <TextField
        placeholder="Search by customer name or invoice #"
        variant="outlined"
        size="small"
        value={search}
        onChange={handleSearchChange}
        sx={{ minWidth: { xs: "100%", md: 300 } }}
        slotProps={{
          input: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Tabs
        value={status}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab value="all" label="All" />
        <Tab value="active" label="Active" />
        <Tab value="completed" label="Completed" />
        <Tab value="cancelled" label="Cancelled" />
      </Tabs>
    </Box>
  );
}
