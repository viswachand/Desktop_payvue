import { useState, useEffect, ChangeEvent, useMemo } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  useTheme,
  Snackbar,
  Divider,
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

  // Redux state
  const items = useSelector(selectAllItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const cart = useSelector(selectCartItems);

  // Local state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Snackbar
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

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

  const filteredItems = useMemo(
    () =>
      items
        .filter((p: Item) => !p.isSold)
        .filter((p: Item) =>
          p.itemName.toLowerCase().includes(search.toLowerCase())
        ),
    [items, search]
  );

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, page]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <SaleLayout>
      <Box>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
          sx={{
            mb: 2.5,
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
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
            <Grid spacing={2}>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((product: Item) => {
                  const productId = product.id || (product as any)._id;
                  const inCart = cart.some((i: Item) => i.id === productId);

                  return (
                    <Grid key={productId} size={{ xs: 12, sm: 6, md: 6 }}>
                      <Card
                        elevation={0}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.background.paper,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                            sx={{ mb: 0.5 }}
                            noWrap
                          >
                            {product.itemName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.itemDescription || "No description."}
                          </Typography>

                          {/* SKU */}
                          {product.itemSKU && (
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{ display: "block", mb: 1 }}
                            >
                              {product.itemSKU}
                            </Typography>
                          )}

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary"
                            sx={{ mt: 1 }}
                          >
                            ${product.costPrice?.toFixed(2) ?? "0.00"}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 2.5, pt: 0 }}>
                          <Button
                            variant={inCart ? "outlined" : "contained"}
                            color={inCart ? "success" : "primary"}
                            fullWidth
                            disabled={inCart}
                            onClick={() => handleAddToCart(product)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              py: 1,
                              borderRadius: 2,
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
