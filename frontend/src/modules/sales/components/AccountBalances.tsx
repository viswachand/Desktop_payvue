import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; 

export default function AccountBalances() {
  const balances = [
    { label: "Account Balance", value: "$0.00" },
    { label: "Loyalty", value: "$0.00" },
    { label: "Store Credit", value: "$0.00" },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={1.5}>
        {balances.map((b) => (
          <Grid key={b.label} size={{ xs: 4 }}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {b.label}
              </Typography>
              <Typography fontWeight={600}>{b.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
