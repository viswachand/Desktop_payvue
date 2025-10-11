import { Box, Typography, Stack, IconButton, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { selectCustomer, clearCustomer } from "@/features/customers/customerSlice";
import type { Customer } from "@payvue/shared/types/customer";

/**
 * Displays the active customer pulled from Redux store.
 * Allows clearing the customer selection.
 */
export default function CustomerCard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customer: Customer | null = useSelector(selectCustomer);

  if (!customer) return null; 

  const handleRemove = () => {
    dispatch(clearCustomer());
  };

  return (
    <Box
      sx={{
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : theme.palette.background.default,
        transition: "all 0.2s ease",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "uppercase",
            }}
          >
            {customer.firstName?.[0] || "?"}
          </Box>

          <Box>
            <Typography fontWeight={600}>
              {customer.firstName} {customer.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.phone}
            </Typography>
            {customer.email && (
              <Typography variant="body2" color="text.secondary">
                {customer.email}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* 🗑️ Delete */}
        <IconButton
          size="small"
          onClick={handleRemove}
          sx={{
            "&:hover": {
              background: "transparent",
              color: theme.palette.error.main,
              transform: "scale(1.1)",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
