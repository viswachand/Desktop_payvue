import React from "react";
import {
  Snackbar as MuiSnackbar,
  Alert,
  SnackbarProps,
  AlertColor,
  AlertProps,
} from "@mui/material";

/**
 * Global Snackbar component (used as <Snackbar /> from "@/components/common")
 * Supports `severity`, message, and auto-hide.
 */
interface CustomSnackbarProps extends Omit<SnackbarProps, "message"> {
  message: React.ReactNode;
  severity?: AlertColor;
  onClose: () => void;
  alertProps?: AlertProps;
}

const Snackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  alertProps,
  sx = {},
  ...props
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={{ ...sx }}
      {...props}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          fontWeight: 500,
          letterSpacing: 0.2,
          ...alertProps?.sx,
        }}
        {...alertProps}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
