import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { createCommonComponents } from "./components/common";

const baseTheme = {
  shape: { borderRadius: 1 },
  typography,
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
});
lightTheme.components = createCommonComponents(lightTheme);

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
});
darkTheme.components = createCommonComponents(darkTheme);
