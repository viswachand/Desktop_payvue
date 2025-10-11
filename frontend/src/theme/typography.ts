import type { ThemeOptions } from "@mui/material/styles";

export const typography: NonNullable<ThemeOptions["typography"]> = {
      fontFamily: `'Public Sans', sans-serif`,

    h1: {
        fontSize: "1.5rem", // 24px
        fontWeight: 600,
        lineHeight: 1.3,
    },
    h2: {
        fontSize: "1.25rem", // 20px
        fontWeight: 500,
        lineHeight: 1.35,
    },
    h3: {
        fontSize: "1.125rem", // 18px
        fontWeight: 500,
        lineHeight: 1.4,
    },
    body1: {
        fontSize: "1rem", // 16px
        fontWeight: 400,
        lineHeight: 1.5,
    },
    body2: {
        fontSize: "0.875rem", // 14px
        fontWeight: 400,
        lineHeight: 1.5,
    },
    button: {
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: 1.5,
    },
    caption: {
        fontSize: "0.75rem", // 12px
        fontWeight: 400,
        lineHeight: 1.4,
    },
};
