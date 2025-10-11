import React from "react";
import { Button, ButtonProps, useTheme } from "@mui/material";

const CustomButton: React.FC<ButtonProps> = ({ children, sx = {}, variant = "contained", ...props }) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      sx={{
        borderRadius: theme.shape.borderRadius,
        boxShadow: "none", 
        textTransform: "none",
        "&:hover": {
          boxShadow: "none",
        },

        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
