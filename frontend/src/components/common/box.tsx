import React from "react";
import { Box as MuiBox, BoxProps as MuiBoxProps } from "@mui/material";

/**
 * Type-safe wrapper around MUI Box.
 * Supports using component="form" and event handlers like onSubmit.
 */
type CustomBoxProps<T extends React.ElementType = "div"> = MuiBoxProps<T> & {
  component?: T;
};

const Box = <T extends React.ElementType = "div">({
  children,
  sx = {},
  ...props
}: CustomBoxProps<T>) => {
  return (
    <MuiBox sx={{ ...sx }} {...props}>
      {children}
    </MuiBox>
  );
};

export default Box;
