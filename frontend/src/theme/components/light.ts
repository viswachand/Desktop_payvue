import type { ThemeOptions } from "@mui/material/styles";
import { createCommonComponents } from "./common";

export const lightComponents: ThemeOptions["components"] = {
    ...createCommonComponents,
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: "none",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                backgroundColor: "#FFFFFF",
            },
        },
    },
};
