import React from "react";
import {
  Snackbar,
  Alert,
  SnackbarProps,
  AlertColor,
  AlertProps,
} from "@mui/material";

interface CustomSnackbarProps extends Omit<SnackbarProps, "message"> {
  /** The text or element displayed inside the snackbar */
  message: React.ReactNode;
  /** Severity of the alert (error, success, info, warning) */
  severity?: AlertColor;
  /** Called when the snackbar is closed */
  onClose: () => void;
  /** Extra props for the Alert component */
  alertProps?: AlertProps;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
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
    // prevent accidental clickaway dismiss unless user explicitly clicks close
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={{ ...sx }}
      {...props}
    >
      {React.createElement(
        Alert as React.ElementType<AlertProps>,
        {
          onClose: handleClose,
          severity,
          variant: "filled",
          sx: {
            width: "100%",
            borderRadius: 2,
            fontWeight: 500,
            letterSpacing: 0.2,
            ...alertProps?.sx,
          },
          ...alertProps,
        },
        message
      )}
    </Snackbar>
  );
};

export default CustomSnackbar;
