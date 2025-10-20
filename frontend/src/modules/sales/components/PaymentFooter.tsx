import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
} from "@/components/common";
import PolicySelect from "@/components/common/PolicySelect";

interface PaymentFooterProps {
  onSelectLayaway: (isLayaway: boolean) => void;
  onSelectPolicy: (policy: { title: string; description: string }) => void;
  remainingAmount?: number;
}

export default function PaymentFooter({
  onSelectLayaway,
  onSelectPolicy,
  remainingAmount = 0,
}: PaymentFooterProps) {
  const theme = useTheme();
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [isLayaway, setIsLayaway] = useState<boolean>(false);

  const isFullyPaid = remainingAmount <= 0;

  const handlePolicyChange = (policy: { title: string; description: string }) => {
    setSelectedPolicy(policy.title);
    onSelectPolicy(policy);
  };

  const handleLayawayToggle = () => {
    if (remainingAmount <= 0) return; // prevent layaway if already paid
    const newValue = !isLayaway;
    setIsLayaway(newValue);
    onSelectLayaway(newValue);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container alignItems="center" spacing={2}>
        {/*  Sale Policy */}
        <Grid size={{ xs: 7 }}>
          <PolicySelect
            value={selectedPolicy}
            onChange={handlePolicyChange}
            label="Sale Policy"
          />
        </Grid>

        {/* 💼 Layaway Button */}
        <Grid size={{ xs: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Button
              variant={isLayaway ? "contained" : "outlined"}
              color="primary"
              onClick={handleLayawayToggle}
              disabled={isFullyPaid}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                px: 3,
                py: 1,
                opacity: isFullyPaid ? 0.6 : 1,
                cursor: isFullyPaid ? "not-allowed" : "pointer",
              }}
            >
              Layaway
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Optional hint when disabled */}
      {isFullyPaid && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block", textAlign: "right" }}
        >
          Layaway is unavailable — full amount paid.
        </Typography>
      )}
    </Box>
  );
}
