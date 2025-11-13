import { useState, useEffect, ChangeEvent, useMemo, useCallback, KeyboardEvent, memo } from "react";
import { CircularProgress, Chip, Pagination, Stack } from "@mui/material";
import { Grid, Typography, Button, Box, TextField, useTheme, Snackbar } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import {
  fetchItems,
  selectAllItems,
  selectItemsLoading,
  selectItemsError,
} from "@/features/items/itemSlice";
import {
  addToCart,
  updateQuantity,
  selectCartItems,
} from "@/features/cart/cartSlice";
import SaleLayout from "../layout/SaleLayout";
import type { Item } from "@payvue/shared/types/item";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

type SnackSeverity = "success" | "error" | "info" | "warning";

const resolveItemId = (item: Item): string =>
  item.id ?? (item as unknown as { _id?: string })._id ?? "";

export default function ItemSale() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector(selectAllItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const cart = useSelector(selectCartItems);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<SnackSeverity>("info");

  // Fetch items
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackMessage(error);
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  }, [error]);

  const availableItems = useMemo(() => items.filter((item: Item) => !item.isSold), [items]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  const handleAddToCart = useCallback(
    (product: Item) => {
      const productId = resolveItemId(product);
      const existing = cart.find((line: Item) => line.id === productId);

      if (existing) {
        dispatch(updateQuantity({ id: productId, qty: existing.qty + 1 }));
        setSnackMessage("Item quantity updated");
        setSnackSeverity("info");
      } else {
        dispatch(addToCart({ ...product, id: productId }));
        setSnackMessage("Item added to cart");
        setSnackSeverity("success");
      }
      setSnackOpen(true);
    },
    [cart, dispatch]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) return availableItems;
    return availableItems.filter((item: Item) => {
      const nameMatch = item.itemName?.toLowerCase().includes(normalizedSearch);
      const skuMatch = item.itemSKU?.toLowerCase().includes(normalizedSearch);
      return nameMatch || skuMatch;
    });
  }, [availableItems, normalizedSearch]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredItems.length / itemsPerPage)),
    [filteredItems.length, itemsPerPage]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, page, itemsPerPage]);

  useEffect(() => {
    if (!normalizedSearch) return;
    const matchIndex = availableItems.findIndex((item) => item.itemSKU?.toLowerCase() === normalizedSearch);
    if (matchIndex >= 0) {
      const nextPage = Math.floor(matchIndex / itemsPerPage) + 1;
      if (nextPage !== page) {
        setPage(nextPage);
      }
    }
  }, [normalizedSearch, availableItems, itemsPerPage, page]);

  const handleSearchSubmit = useCallback(() => {
    if (!normalizedSearch) return;
    const exactMatch = availableItems.find((item) => item.itemSKU?.toLowerCase() === normalizedSearch);
    if (exactMatch) {
      handleAddToCart(exactMatch);
      setSearch("");
      setPage(1);
    }
  }, [normalizedSearch, availableItems, handleAddToCart]);

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const handleBarcodeScan = useCallback(
    (value: string) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return;
      const exactMatch = availableItems.find((item) => item.itemSKU?.toLowerCase() === normalized);
      if (exactMatch) {
        handleAddToCart(exactMatch);
        setSearch("");
        setPage(1);
      } else {
        setSearch(value);
        setSnackMessage("No item matches scanned barcode");
        setSnackSeverity("warning");
        setSnackOpen(true);
      }
    },
    [availableItems, handleAddToCart, setPage, setSearch, setSnackMessage, setSnackOpen, setSnackSeverity]
  );

  useBarcodeScanner({
    onScan: handleBarcodeScan,
    shouldCapture: (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return true;
      const tag = target.tagName?.toLowerCase();
      const isEditable = target.getAttribute("contenteditable") === "true";
      return !isEditable && tag !== "input" && tag !== "textarea";
    },
  });

  return (
    <SaleLayout>
      <Box>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          sx={{
            mb: 2.5,
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.customShadows.popover
          }}
        />

        {/* Loading State */}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Item Grid */}
        {!isLoading && (
          <>
            <Grid spacing={2.5} alignItems="stretch">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((product: Item) => {
                  const productId = resolveItemId(product);
                  const inCart = cart.some((entry: Item) => entry.id === productId);
                  return (
                    <Grid
                      key={productId}
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      sx={{ display: "flex" }}
                    >
                      <ItemCard item={product} inCart={inCart} onAdd={handleAddToCart} />
                    </Grid>
                  );
                })
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    No items found.
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack alignItems="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            )}
          </>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackOpen}
          onClose={() => setSnackOpen(false)}
          message={snackMessage}
          severity={snackSeverity}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
      </Box>
    </SaleLayout>
  );
}

interface ItemCardProps {
  item: Item;
  inCart: boolean;
  onAdd: (item: Item) => void;
}

const ItemCard = memo(function ItemCard({ item, inCart, onAdd }: ItemCardProps) {
  const theme = useTheme();
  const sku = item.itemSKU ?? "Unlisted";
  const formattedPrice = item.costPrice ? item.costPrice.toFixed(2) : "0.00";

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        boxShadow: theme.customShadows?.card,
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.customShadows?.popover ?? theme.shadows[8],
        },
      }}
    >
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Box
          sx={{
            mb: 2,
            borderRadius: theme.shape.borderRadius,
            background:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.3 }}>
            {item.itemName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.itemDescription || "No description available."}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Chip size="small" label={`SKU: ${sku}`} variant="outlined" />
          {item.itemType && (
            <Chip size="small" label={item.itemType.toUpperCase()} color="primary" variant="outlined" />
          )}
        </Stack>

        <Typography variant="h5" fontWeight={700} color="primary">
          ${formattedPrice}
        </Typography>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>
        <Button
          variant={inCart ? "outlined" : "contained"}
          color={inCart ? "success" : "primary"}
          fullWidth
          disabled={inCart}
          onClick={() => onAdd(item)}
          sx={{ textTransform: "none", fontWeight: 600, py: 1.1, borderRadius: theme.shape.borderRadius }}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </Button>
      </Box>
    </Box>
  );
});
