import React from "react";
import { TextField, MenuItem, TextFieldProps, useTheme } from "@mui/material";

type Option = { value: string | number; label: string };

interface CustomSelectFieldProps extends Omit<TextFieldProps, "select"> {
  options: Option[];
  minWidth?: number;
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  value,
  onChange,
  options,
  minWidth = 150,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <TextField
      select
      size="small"
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={{
        minWidth,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.common.white
            : theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
        },
        "& .MuiSelect-select": {
          py: 1,
        },
        ...sx,
      }}
      {...props}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomSelectField;
