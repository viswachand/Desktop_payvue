import type { Theme } from "@mui/material/styles";
import { border, CSSObject, textAlign } from "@mui/system";

export const createCommonComponents = (theme: Theme) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        padding: "8px 20px",
        minHeight: 40,
      } as CSSObject,
      containedPrimary: {
        color: theme.palette.getContrastText(theme.palette.primary.main),
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      root: {
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        gap: theme.spacing(1),

        "& textarea": {
          overflow: "hidden !important",
          resize: "none !important",
        },

        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
          {
            WebkitAppearance: "none",
            margin: 0,
          },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },

        "& .MuiOutlinedInput-root": {
          borderRadius: theme.shape.borderRadius,
          borderColor: theme.palette.divider,
          transition: "all 0.2s ease",
          "& fieldset": {
            top: 0,
            borderColor: theme.palette.divider,
          },
          "& legend": { display: "none" },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
        },

        "& .MuiOutlinedInput-input": {
          padding: "10.5px 14px",
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          fontSize: "0.9rem",
          "&::placeholder": {
            color: theme.palette.text.disabled,
            opacity: 1,
          },
        },

        // 🧩 Label
        "& .MuiInputLabel-root": {
          color: theme.palette.text.primary,
          fontSize: "0.875rem",
          fontWeight: 500,
          position: "static",
          transform: "none",
          marginBottom: theme.spacing(0.5),
          "&.Mui-focused": {
            color: theme.palette.text.secondary,
          },
        },
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: "0.75rem",
        fontWeight: 400,
        color: theme.palette.text.secondary,
        lineHeight: 1.5,
        marginLeft: 0,
        marginTop: 0,
        "&.Mui-error": {
          marginTop: 0,
          color: theme.palette.error.main,
          fontWeight: 400,
          fontSize: "0.75rem",
          lineHeight: 1.5,
        },
      },
    },
  },

  MuiDataGrid: {
    defaultProps: {
      disableColumnResize: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 0,
        border: `1px solid ${
          theme.palette.mode === "light"
            ? theme.palette.divider
            : theme.palette.background.default
        }`,
        backgroundColor: theme.palette.background.paper,
        "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader, \
         & .MuiDataGrid-row--borderBottom .MuiDataGrid-filler, \
         & .MuiDataGrid-row--borderBottom .MuiDataGrid-scrollbarFiller": {
          borderBottom: "0 !important",
          borderTop: "0 !important",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.background.default,
        },
        "& .MuiDataGrid-columnSeparator": {
          display: "none !important",
        },
        "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within, \
         & .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
          boxShadow: "none !important",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
        },
      },
      columnHeaderTitle: {
        fontWeight: 700,
        fontSize: "0.75rem",
        color: theme.palette.text.primary,
        textTransform: "uppercase",
        letterSpacing: "0.06rem",
        textAlign: "left",
      justifyContent: "flex-start",
      },
      columnHeaders: {
        verticalAlign: "center",
        textAlign: "start",
        padding: "12px 5px",
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.background.default,
        fontSize: "0.75rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.05rem",
      },
      cell: {
        display: "flex",
        alignItems: "center",
        fontSize: "0.9rem",
        color: theme.palette.text.primary,
      },
      row: {
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[50]
              : theme.palette.action.hover,
        },
        borderBottom: `0.8px solid ${
          theme.palette.mode === "light"
            ? theme.palette.divider
            : theme.palette.background.default
        }`,
      },
      footerContainer: {
        borderTop: "none",
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.background.default,
      },
    },
  },
});
