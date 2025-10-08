import { Menu, MenuProps } from "@mui/material";
import { PaperProps as MuiPaperProps } from "@mui/material/Paper";

interface CustomMenuProps extends MenuProps {
  /** Optional custom Paper styling */
  PaperProps?: MuiPaperProps;
}

const CustomMenu = ({ PaperProps, ...props }: CustomMenuProps) => {
  return (
    <Menu
      {...props}
      slotProps={{
        paper: {
          ...PaperProps,
        },
      }}
    />
  );
};

export default CustomMenu;
