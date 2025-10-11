import { useState, useEffect, ChangeEvent, useMemo } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  useTheme,
  Snackbar,
} from "@/components/common";
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
import SaleLayout from "./layout/SaleLayout";
import type { Item } from "@payvue/shared/types/item";

type SnackSeverity = "success" | "error" | "info" | "warning";

export default function ItemSale() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const items = useSelector(selectAllItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const cart = useSelector(selectCartItems);

  // Local state
  const [search, setSearch] = useState<string>("");

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<SnackSeverity>("info");

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

  const handleAddToCart = (product: Item): void => {
    const productId = product.id || (product as any)._id;
    const existing = cart.find((i: Item) => i.id === productId);

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
  };

  // Filter items by search term
  const filteredItems = useMemo(
    () =>
      items
        .filter((p: Item) => !p.isSold)
        .filter((p: Item) =>
          p.itemName.toLowerCase().includes(search.toLowerCase())
        ),
    [items, search]
  );

  // Handle search input
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <SaleLayout>
      <Box>
        {/* 🔍 Search Field */}
        <TextField
          fullWidth
          placeholder="Search products..."
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{
            mb: 2,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        />

        {/* ⏳ Loading State */}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {/* 🧾 Product Grid */}
        {!isLoading && (
          <Grid container spacing={2.5}>
            {filteredItems.length > 0 ? (
              filteredItems.map((product: Item) => {
                const productId = product.id || (product as any)._id;
                const inCart = cart.some((i: Item) => i.id === productId);

                return (
                  <Grid key={productId} size={{ md: 3 }}>
                    <Card
                    elevation={0}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        borderRadius: 1,
                        border:`0.7px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color="text.primary"
                          noWrap
                          sx={{ mb: 0.5 }}
                        >
                          {product.itemName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {product.itemDescription ||
                            "No description available."}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.6,
                            fontSize: "0.875rem",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Category:</strong>{" "}
                            {product.itemCategory ?? "—"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Cost Price:</strong> $
                            {product.costPrice?.toFixed(2) ?? "0.00"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {product.quantity ?? 0}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                        <Button
                          variant={inCart ? "outlined" : "contained"}
                          color={inCart ? "success" : "primary"}
                          size="medium"
                          fullWidth
                          disabled={inCart}
                          onClick={() => handleAddToCart(product)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: 600,
                            py: 1,
                            opacity: inCart ? 0.8 : 1,
                          }}
                        >
                          {inCart ? "Added" : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 4 }}
                >
                  No items found.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* ⚡ Snackbar */}
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
