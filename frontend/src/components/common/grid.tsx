import React from "react";
import Grid, { GridProps } from "@mui/material/Grid"; 

/**
 * Reusable wrapper around MUI Grid (v7)
 * Automatically applies container + spacing
 */
const CustomGrid: React.FC<GridProps> = ({
  children,
  sx = {},
  spacing = 2,
  ...props
}) => {
  return (
    <Grid container spacing={spacing} sx={{ ...sx }} {...props}>
      {children}
    </Grid>
  );
};

export default CustomGrid;
