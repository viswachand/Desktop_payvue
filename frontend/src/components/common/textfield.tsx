import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

/**
 * 🔹 Reusable CustomTextField
 * - Uses global theme overrides for all visuals
 * - Keeps placeholders visible (label shrink)
 * - Provides accessibility attributes
 */
const CustomTextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
  slotProps,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="medium"
      label={label}
      name={name}
      placeholder={placeholder}
      slotProps={{
        inputLabel: {
          shrink: true, 
          ...slotProps?.inputLabel,
        },
        input: {
          id: name,
          placeholder,
          "aria-describedby": `${name}-helper-text`,
          ...slotProps?.input,
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;
