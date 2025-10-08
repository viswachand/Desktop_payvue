import React from "react";
import { IconButton as MuiIconButton, IconButtonProps } from "@mui/material";

const CustomIconButton: React.FC<IconButtonProps> = ({
  children,
  sx = {},
  ...props
}) => {
  return (
    <MuiIconButton sx={{ ...sx }} {...props}>
      {children}
    </MuiIconButton>
  );
};

export default CustomIconButton;
