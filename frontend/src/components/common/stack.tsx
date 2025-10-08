import React from "react";
import { Stack as MuiStack, StackProps } from "@mui/material";

const Stack: React.FC<StackProps> = ({ children, sx = {}, ...props }) => {
  return (
    <MuiStack sx={{ ...sx }} {...props}>
      {children}
    </MuiStack>
  );
};

export default Stack;
