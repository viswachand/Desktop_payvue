import {
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  useTheme,
} from "@/components/common";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems, CartItem } from "@/features/cart/cartSlice";
import { selectDiscount, selectComment } from "@/features/payments/paymentSlice";
import { useMemo } from "react";
import { calculateSaleTotals } from "@/utils/saleHelpers";
import { selectAdminConfig } from "@/features/admin/adminSlice";

export default function AmountSummary() {
  const theme = useTheme();
  const navigate = useNavigate();

  const admin = useSelector(selectAdminConfig);
  const taxRate = admin?.taxRate ?? 8; // percent (or decimal, handled below)

  const cart = useSelector(selectCartItems);
  const discount = useSelector(selectDiscount);
  const comment = useSelector(selectComment);

  // ✅ Calculate totals using actual taxRate
  const { subtotal, tax, total } = useMemo(
    () => calculateSaleTotals(cart, discount, taxRate),
    [cart, discount, taxRate]
  );

  const totalItems = useMemo(
    () => cart.reduce((acc: number, item: CartItem) => acc + item.qty, 0),
    [cart]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "light"
            ? "0px 2px 8px rgba(0,0,0,0.06)"
            : "0px 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.2} mb={2}>
        <IconButton
          onClick={() => navigate(-1)}
          size="small"
          sx={{
            color: theme.palette.primary.main,
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h1" fontWeight={700}>
          Sale
        </Typography>
      </Stack>

      {/* Items */}
      <Box
        sx={{
          maxHeight: 260,
          overflowY: "auto",
          pr: 0.5,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {cart.length > 0 ? (
          cart.map((item: CartItem) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              py={0.8}
            >
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Typography fontWeight={600}>{item.qty}×</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {item.itemName}
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500}>
                ${(item.costPrice * item.qty).toFixed(2)}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            py={1}
          >
            No items in cart
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Totals */}
      <Stack direction="row" justifyContent="space-between" mb={0.6}>
        <Typography color="text.secondary">Sub-total</Typography>
        <Typography fontWeight={500}>${subtotal.toFixed(2)}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mb={0.6}>
        {/* ✅ Corrected tax line */}
        <Typography color="text.secondary">
          Tax ({taxRate > 1 ? taxRate.toFixed(2) : (taxRate * 100).toFixed(2)}%)
        </Typography>
        <Typography fontWeight={500}>${tax.toFixed(2)}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mb={0.6}>
        <Typography color="text.secondary">Discount</Typography>
        <Typography color="success.main" fontWeight={500}>
          -${(discount ?? 0).toFixed(2)}
        </Typography>
      </Stack>

      <Divider sx={{ my: 1.2 }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            SALE TOTAL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
          color={theme.palette.primary.main}
        >
          ${total.toFixed(2)}
        </Typography>
      </Stack>

      {/* Optional Comment */}
      {comment && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            p: 1.2,
            borderRadius: 1.5,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          {comment}
        </Typography>
      )}
    </Box>
  );
}
