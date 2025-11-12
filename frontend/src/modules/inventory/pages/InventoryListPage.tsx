import React, { useEffect, useState, useMemo } from "react";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { Grid, Typography, Box, useTheme } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  fetchItems,
  selectAllItems,
  selectItemsLoading,
  selectItemsError,
  clearItemsError,
} from "@/features/items/itemSlice";
import InventoryFilters from "../components/InventoryFilters";
import ItemStats from "../components/ItemStats";
import InventoryTable from "../components/InventoryTable";
import EmptyState from "../components/EmptyState";
import type { Item } from "@payvue/shared/types/item";

export default function InventoryListPage() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector(selectAllItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleCloseError = () => {
    dispatch(clearItemsError());
  };

const filteredItems = useMemo(() => {
  return items.filter((item) => {
    const matchesSearch =
      item.itemName?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      item.itemCategory === category ||
      (typeof item.itemCategory === "object" &&
        item.itemCategory.name === category);

    const matchesStatus =
      status === "All" ||
      (status === "InStock" && !item.isSold) ||
      (status === "Sold" && item.isSold);

    return matchesSearch && matchesCategory && matchesStatus;
  });
}, [items, search, category, status]);

  const csvColumns = useMemo(
    () => [
      {
        header: "itemSKU",
        accessor: (item: Item) => item.itemSKU ?? "",
      },
      {
        header: "itemName",
        accessor: (item: Item) => item.itemName ?? "",
      },
      {
        header: "itemDescription",
        accessor: (item: Item) => item.itemDescription ?? "",
      },
      {
        header: "costPrice",
        accessor: (item: Item) => item.costPrice ?? "",
      },
      {
        header: "unitPrice",
        accessor: (item: Item) => item.unitPrice ?? "",
      },
      {
        header: "quantity",
        accessor: (item: Item) => item.quantity ?? "",
      },
      {
        header: "itemCategory",
        accessor: (item: Item) =>
          typeof item.itemCategory === "object" && item.itemCategory !== null
            ? (item.itemCategory as any).name ?? ""
            : item.itemCategory ?? "",
      },
    ],
    []
  );

  const downloadFileName = useMemo(() => {
    const safeStatus = (status || "all").toLowerCase();
    return `inventory-${safeStatus || "all"}`;
  }, [status]);


  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        mb={2}
        sx={{ color: theme.palette.text.primary }}
      >
        Inventory Management
      </Typography>

      <Box mb={2}>
        <ItemStats items={filteredItems} />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.customShadows.card,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: { xs: 1, md: 2 },
            borderTop: `1px solid ${theme.palette.divider}`,
            borderLeft: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <InventoryFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            csvData={filteredItems}
            csvColumns={csvColumns}
            csvFileName={downloadFileName}
          />
        </Box>

        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.common.white
                : theme.palette.background.default,
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : filteredItems.length > 0 ? (
            <InventoryTable items={filteredItems} />
          ) : (
            <EmptyState message="No items found in inventory." />
          )}
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
