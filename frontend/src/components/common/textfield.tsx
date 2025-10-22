import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

/**
 * 🔹 CustomTextField
 * - Keeps labels always visible (shrink)
 * - Forwards Formik handlers correctly
 * - Uses slotProps instead of deprecated InputLabelProps
 */
const CustomTextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
  slotProps,
  value,
  onChange,
  onBlur,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="medium"
      name={name}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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
