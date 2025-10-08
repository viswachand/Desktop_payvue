import React from "react";
import { Button, ButtonProps } from "@mui/material";

const CustomButton: React.FC<ButtonProps> = ({ children, sx = {}, ...props }) => {
  return (
    <Button sx={{ ...sx }} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
