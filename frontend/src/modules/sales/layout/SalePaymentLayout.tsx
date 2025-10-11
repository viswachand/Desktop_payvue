import { Box, useTheme } from "@/components/common";
import { APPBAR_HEIGHT, CART_WIDTH } from "@/utils/constants";

interface SalePaymentLayoutProps {
  left: React.ReactNode;  // Summary / order recap
  right: React.ReactNode; // Payment panel
}

export default function SalePaymentLayout({ left, right }: SalePaymentLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.background.default,
        overflow: "hidden",
        p: 0,
      }}
    >
      {/* Left Section (Summary / Order details) */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 8,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        {left}
      </Box>

      {/* Right Section (Payment panel) */}
      <Box
        sx={{
          width: 500, // maintain same width as cart panel for visual consistency
          p: 3,
          overflowY: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
