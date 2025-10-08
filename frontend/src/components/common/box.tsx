import React from "react";
import { Box, BoxProps } from "@mui/material";

const CustomBox: React.FC<BoxProps> = ({ children, sx = {}, ...props }) => {
  return (
    <Box sx={{ ...sx }} {...props}>
      {children}
    </Box>
  );
};

export default CustomBox;
