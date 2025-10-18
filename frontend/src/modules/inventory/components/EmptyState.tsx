import React from "react";
import { Box, Typography, Button, useTheme } from "@/components/common";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

interface Props {
  message?: string;
  onAdd?: () => void;
  showButton?: boolean;
}

export default function EmptyState({
  message = "No data available.",
  onAdd,
  showButton = false,
}: Props) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={400}
      sx={{
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.background.paper,
        textAlign: "center",
        p: 3,
      }}
    >
      <Inventory2RoundedIcon
        sx={{
          fontSize: 60,
          color: theme.palette.grey[400],
          mb: 1,
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.text.secondary,
          mb: showButton ? 1.5 : 0,
        }}
      >
        {message}
      </Typography>

      {showButton && (
        <Button
          variant="contained"
          onClick={onAdd}
          sx={{
            mt: 1,
            textTransform: "none",
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          + Add Item
        </Button>
      )}
    </Box>
  );
}
