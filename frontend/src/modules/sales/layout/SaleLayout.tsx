import { useTheme } from "@mui/material";
import { Box } from "@/components/common";
import CartPanel from "../components/CartPanel";
import { APPBAR_HEIGHT, CART_WIDTH } from "@/utils/constants";

interface SaleLayoutProps {
  children: React.ReactNode;
}

export default function SaleLayout({ children }: SaleLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
        backgroundColor:theme.palette.background.default,
        overflow: "hidden",
        p: 0,
      }}
    >
      <Box
        sx={{
          flex: "1 1 60%",
          overflowY: "auto",
          pt: 3, // top padding
          pb: 3, // bottom padding
          pl: 3, // left padding
          pr: 0, // no right padding
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          width: CART_WIDTH,
          p: 3,
          overflowY: "auto",

        }}
        
      >
        <CartPanel />
      </Box>
    </Box>
  );
}
