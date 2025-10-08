import React from "react";
import { Typography, TypographyProps } from "@mui/material";

const CustomTypography: React.FC<TypographyProps> = ({
  children,
  sx = {},
  ...props
}) => {
  return (
    <Typography sx={{ ...sx }} {...props}>
      {children}
    </Typography>
  );
};

export default CustomTypography;
