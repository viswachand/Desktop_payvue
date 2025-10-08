import type { ThemeOptions } from "@mui/material/styles";
import { createCommonComponents } from "./common";

export const darkComponents: ThemeOptions["components"] = {
    ...createCommonComponents,
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: "none",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "#1E1E1E",
            },
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: "#1E1E1E",
                borderRight: "1px solid rgba(255,255,255,0.1)",
            },
        },
    },
};
