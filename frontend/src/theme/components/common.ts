import { Height } from "@mui/icons-material";
import type { Theme } from "@mui/material/styles";

export const createCommonComponents = (theme: Theme) => ({
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                fontWeight: 600,
                padding: "8px 20px",
                minHeight: 40,
            },
            containedPrimary: {
                color: theme.palette.getContrastText(theme.palette.primary.main),
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                backgroundColor: theme.palette.background.paper,
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: "none",
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundImage: "none",
                backgroundColor: theme.palette.background.default,
            },
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: theme.shadows[1],
                backgroundColor: theme.palette.background.paper,
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                "& .MuiOutlinedInput-root": {
                    borderRadius: 5,
                    transition: "all 0.2s ease",
                    // Base border
                    "& fieldset": {
                        borderColor: theme.palette.divider,
                    },
                    // Hover state
                    "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                    },
                    // Focused state
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                    },
                },
                "& .MuiInputLabel-root": {
                    color: theme.palette.text.secondary,
                    "&.Mui-focused": {
                        color: theme.palette.primary.main,
                    },
                },
                "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                },
            },
        },
    },

});
