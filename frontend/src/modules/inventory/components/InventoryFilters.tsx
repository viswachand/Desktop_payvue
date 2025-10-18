import React, { useEffect } from "react";
import {
  TextField,
  Button,
  useTheme,
  Grid,
  Select,
} from "@/components/common";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ added
import type { AppDispatch } from "@/app/store";
import {
  fetchCategories,
  selectAllCategories,
  selectCategoryLoading,
} from "@/features/category/category";

interface InventoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
}

export default function InventoryFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
}: InventoryFiltersProps) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // ✅ useNavigate hook

  const categories = useSelector(selectAllCategories);
  const loadingCategories = useSelector(selectCategoryLoading);

  // ✅ Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
  };

  return (
    <Grid
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* 🔍 Search Bar */}
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={search}
          placeholder="Search items..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.common.white
                : theme.palette.background.default,
            borderRadius: 1,
            input: { color: theme.palette.text.primary },
            boxShadow:
              theme.palette.mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.05)"
                : "inset 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        />
      </Grid>

      {/* ⚙️ Filters + Actions */}
      <Grid
        size={{ xs: 12, md: 8 }}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* 🟡 Category Filter */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value as string)}
          options={[
            { value: "All", label: "All Categories" },
            ...(loadingCategories
              ? [{ value: "", label: "Loading..." }]
              : categories.map((cat) => ({
                  value: cat.name,
                  label: cat.name,
                }))),
          ]}
          minWidth={180}
        />

        {/* 🟢 Status Filter */}
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
          options={[
            { value: "All", label: "All Status" },
            { value: "InStock", label: "In Stock" },
            { value: "Sold", label: "Sold" },
          ]}
          minWidth={180}
        />

        {/* 🔁 Reset Button */}
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltRoundedIcon />}
          onClick={handleReset}
          sx={{
            height: 40,
            color: theme.palette.text.primary,
            borderColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[400]
                : theme.palette.grey[700],
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[50]
                  : theme.palette.background.default,
            },
          }}
        >
          Reset
        </Button>

        {/* ➕ Add Item Button */}
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          onClick={() => navigate("/inventory/addItem")} 
          sx={{
            height: 40,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontWeight: 500,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Add Item
        </Button>
      </Grid>
    </Grid>
  );
}
