import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { createCommonComponents } from "./components/common";

export const lightTheme = createTheme({
    palette: lightPalette,
    typography,
});

lightTheme.components = {
    ...createCommonComponents(lightTheme),
};

export const darkTheme = createTheme({
    palette: darkPalette,
    typography,
});

darkTheme.components = {
    ...createCommonComponents(darkTheme),
};
