import type { PaletteOptions } from "@mui/material/styles";

export const lightPalette: PaletteOptions = {
    mode: "light",
    primary: {
        main: "#1976D2",
        dark: "#1565C0",
        contrastText: "#FFFFFF",
    },
    secondary: {
        main: "#9C27B0",
        contrastText: "#FFFFFF",
    },
    background: {
        default: "rgb(250, 250, 251)",
        paper: "#FFFFFF",
        login: "linear-gradient(135deg, #6366F1 0%, #9333EA 100%)",
        auth: "#4F46E5",
    },
    text: {
        primary: "#111827",
        secondary: "#595959",
    },
    divider: "#d5d8db",
    success: {
        main: "#2E7D32",
        contrastText: "#FFFFFF",
    },
    error: {
        main: "#D32F2F",
        contrastText: "#FFFFFF",
    },
    warning: {
        main: "#ED6C02",
        contrastText: "#FFFFFF",
    },
    info: {
        main: "#0288D1",
        contrastText: "#FFFFFF",
    },
    grey: {
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
    },
};

export const darkPalette: PaletteOptions = {
    mode: "dark",
    primary: {
        main: "#1976D2",
        dark: "#1565C0",
        contrastText: "#FFFFFF",
    },
    secondary: {
        main: "#9C27B0",
        contrastText: "#FFFFFF",
    },
    background: {
        default: "#121212",
        paper: "#1E1E1E",
        login: "linear-gradient(135deg, #6366F1 0%, #9333EA 100%)",
        auth: "#4F46E5",
    },
    text: {
        primary: "#FFFFFF",
        secondary: "#9CA3AF",
    },
    divider: "#2D2D2D",
    success: {
        main: "#2E7D32",
        contrastText: "#FFFFFF",
    },
    error: {
        main: "#D32F2F",
        contrastText: "#FFFFFF",
    },
    warning: {
        main: "#ED6C02",
        contrastText: "#FFFFFF",
    },
    info: {
        main: "#0288D1",
        contrastText: "#FFFFFF",
    },
    grey: {
        100: "#1E1E1E",
        200: "#2D2D2D",
        300: "#3C3C3C",
        400: "#505050",
        500: "#6E6E6E",
        600: "#9CA3AF",
        700: "#BDBDBD",
        800: "#E0E0E0",
        900: "#FFFFFF",
    },
};
