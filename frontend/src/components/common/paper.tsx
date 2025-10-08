import React from "react";
import { Paper, PaperProps } from "@mui/material";

const CustomPaper: React.FC<PaperProps> = ({ children, sx = {}, ...props }) => {
  return (
    <Paper sx={{ ...sx }} {...props}>
      {children}
    </Paper>
  );
};

export default CustomPaper;
