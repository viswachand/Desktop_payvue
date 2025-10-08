import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

const CustomTextField: React.FC<TextFieldProps> = ({ sx = {}, ...props }) => {
  return <TextField sx={{ ...sx }} {...props} />;
};

export default CustomTextField;
