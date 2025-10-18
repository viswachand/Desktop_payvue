import React from "react";
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardProps,
  CardHeaderProps,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";

interface CustomCardProps extends CardProps {
  title?: string;
  subheader?: string;
  showHeaderDivider?: boolean; // 👈 add this prop
  headerProps?: Omit<CardHeaderProps, "title" | "subheader">;
  contentSx?: object;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subheader,
  headerProps,
  showHeaderDivider = false, // 👈 default: off
  contentSx = {},
  children,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiCard
      // elevation={1}
      sx={{
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        boxShadow:"none",
        ...sx,
      }}
      {...props}
    >
      {(title || subheader) && (
        <>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
            }
            subheader={
              subheader ? (
                <Typography variant="body1" color="text.secondary">
                  {subheader}
                </Typography>
              ) : undefined
            }
            {...headerProps}
          />
          {showHeaderDivider && <Divider />} {/* 👈 divider here */}
        </>
      )}

      <CardContent sx={{ p: 3, ...contentSx }}>{children}</CardContent>
    </MuiCard>
  );
};

export default CustomCard;
