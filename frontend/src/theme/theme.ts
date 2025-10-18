import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { createCommonComponents } from "./components/common";

const baseTheme = {
  shape: { borderRadius: 2 },
  typography,
  customShadows: {
    card: "0px 3px 8px rgba(0,0,0,0.09)",
    dialog: "0px 4px 12px rgba(0,0,0,0.1)",
    popover: "0px 3px 8px rgba(0,0,0,0.06)",
    header: "0px 1px 4px rgba(0,0,0,0.08)",
  },
};
const lightShadows: string[] = [
  "none",
  "0px 1px 2px rgba(0,0,0,0.04)",
  "0px 1px 4px rgba(0,0,0,0.06)",
  "0px 2px 8px rgba(0,0,0,0.08)",
  "0px 4px 12px rgba(0,0,0,0.1)",
  "0px 6px 16px rgba(0,0,0,0.12)",
  "0px 8px 20px rgba(0,0,0,0.14)",
  "0px 10px 24px rgba(0,0,0,0.15)",
  "0px 12px 28px rgba(0,0,0,0.16)",
  "0px 14px 32px rgba(0,0,0,0.17)",
  "0px 16px 36px rgba(0,0,0,0.18)",
  "0px 18px 40px rgba(0,0,0,0.19)",
  "0px 20px 44px rgba(0,0,0,0.2)",
  "0px 22px 48px rgba(0,0,0,0.21)",
  "0px 24px 52px rgba(0,0,0,0.22)",
  "0px 26px 56px rgba(0,0,0,0.23)",
  "0px 28px 60px rgba(0,0,0,0.24)",
  "0px 30px 64px rgba(0,0,0,0.25)",
  "0px 32px 68px rgba(0,0,0,0.26)",
  "0px 34px 72px rgba(0,0,0,0.27)",
  "0px 36px 76px rgba(0,0,0,0.28)",
  "0px 38px 80px rgba(0,0,0,0.29)",
  "0px 40px 84px rgba(0,0,0,0.3)",
  "0px 42px 88px rgba(0,0,0,0.31)",
  "0px 44px 92px rgba(0,0,0,0.32)",
];

const darkShadows: string[] = [
  "none",
  "0px 1px 2px rgba(0,0,0,0.4)",
  "0px 1px 4px rgba(0,0,0,0.45)",
  "0px 2px 8px rgba(0,0,0,0.5)",
  "0px 4px 12px rgba(0,0,0,0.55)",
  "0px 6px 16px rgba(0,0,0,0.6)",
  "0px 8px 20px rgba(0,0,0,0.62)",
  "0px 10px 24px rgba(0,0,0,0.64)",
  "0px 12px 28px rgba(0,0,0,0.66)",
  "0px 14px 32px rgba(0,0,0,0.68)",
  "0px 16px 36px rgba(0,0,0,0.7)",
  "0px 18px 40px rgba(0,0,0,0.72)",
  "0px 20px 44px rgba(0,0,0,0.74)",
  "0px 22px 48px rgba(0,0,0,0.76)",
  "0px 24px 52px rgba(0,0,0,0.78)",
  "0px 26px 56px rgba(0,0,0,0.8)",
  "0px 28px 60px rgba(0,0,0,0.82)",
  "0px 30px 64px rgba(0,0,0,0.84)",
  "0px 32px 68px rgba(0,0,0,0.86)",
  "0px 34px 72px rgba(0,0,0,0.88)",
  "0px 36px 76px rgba(0,0,0,0.9)",
  "0px 38px 80px rgba(0,0,0,0.92)",
  "0px 40px 84px rgba(0,0,0,0.94)",
  "0px 42px 88px rgba(0,0,0,0.96)",
  "0px 44px 92px rgba(0,0,0,0.98)",
];

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
  shadows: lightShadows as any,
});
lightTheme.components = createCommonComponents(lightTheme);

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
  shadows: darkShadows as any,
});
darkTheme.components = createCommonComponents(darkTheme);
