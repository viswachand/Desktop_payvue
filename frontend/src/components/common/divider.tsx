import React from "react";
import { Divider as MuiDivider, DividerProps } from "@mui/material";

const CustomDivider: React.FC<DividerProps> = ({ sx = {}, ...props }) => {
  return <MuiDivider sx={{ ...sx }} {...props} />;
};

export default CustomDivider;
