import { Grid, TextField, Typography, Box } from "@/components/common";
type PricingDraft = {
  livePricePerGram24k: string;
  buyRate: string;
  fees: {
    testFee: string;
    refiningPerGram: string;
  };
};

interface GoldBuyPricingCardProps {
  pricing: {
    livePricePerGram24k: string;
    buyRate: string;
    fees: {
      testFee: string;
      refiningPerGram: string;
    };
  };
  onChange: (value: PricingDraft) => void;
}

export default function GoldBuyPricingCard({ pricing, onChange }: GoldBuyPricingCardProps) {
  const handleField = (field: keyof PricingDraft, value: string) => {
    onChange({ ...pricing, [field]: value });
  };

  const handleFee = (field: "testFee" | "refiningPerGram", value: string) => {
    onChange({
      ...pricing,
      fees: { ...pricing.fees, [field]: value },
    });
  };

  const livePrice = Number(pricing.livePricePerGram24k) || 0;
  const buyRate = Number(pricing.buyRate) || 0;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Pricing
      </Typography>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="24K Live Price ($/g)"
            type="number"
            value={pricing.livePricePerGram24k}
            onChange={(e) => handleField("livePricePerGram24k", e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Buy Rate (%)"
            type="number"
            value={pricing.buyRate}
            onChange={(e) => handleField("buyRate", e.target.value)}
            fullWidth
            inputProps={{ min: 0, max: 100, step: 0.1 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Testing Fee ($)"
            type="number"
            value={pricing.fees.testFee}
            onChange={(e) => handleFee("testFee", e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Refining Fee ($/g)"
            type="number"
            value={pricing.fees.refiningPerGram}
            onChange={(e) => handleFee("refiningPerGram", e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 0.001 }}
          />
        </Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Effective buy price
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          ${(livePrice * (buyRate / 100)).toFixed(2)} / g
        </Typography>
      </Box>
    </Box>
  );
}
