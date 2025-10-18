import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        login?: string;
        auth?: string;
    }
}

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: {
      card: string;
      dialog: string;
      popover: string;
      header: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      dialog?: string;
      popover?: string;
      header?: string;
    };
  }
}