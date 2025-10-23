import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Box, Button, Grid, TextField, Typography, useTheme } from "@/components/common";
import type { GoldBuyItem, GoldBuyPricing } from "@payvue/shared/types/goldBuy";
import { deriveGoldBuyItem } from "@/utils/goldBuy";

export interface GoldBuyItemDraft extends GoldBuyItem {
  _localId: string;
}

interface GoldBuyItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: GoldBuyItemDraft) => void;
  pricing: Pick<GoldBuyPricing, "livePricePerGram24k" | "buyRate">;
  initialItem?: GoldBuyItemDraft | null;
}

const goldKaratOptions = [24, 22, 21, 20, 18, 16, 14, 10];
const metalOptions: GoldBuyItem["metal"][] = ["gold", "silver", "platinum"];

const createLocalId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function GoldBuyItemDialog({
  open,
  onClose,
  onSave,
  pricing,
  initialItem,
}: GoldBuyItemDialogProps) {
  const theme = useTheme();
  const [values, setValues] = useState({
    type: "",
    metal: "gold" as GoldBuyItem["metal"],
    karat: 24,
    purity: 1,
    autoPurity: true,
    testMethod: "",
    notes: "",
    weightGrams: "",
    stoneWeightGrams: "",
    lineFees: "",
    netWeightGrams: 0,
    fineGoldGrams: 0,
    linePayout: 0,
  });

  useEffect(() => {
    if (initialItem) {
      setValues({
        type: initialItem.type,
        metal: initialItem.metal,
        karat: initialItem.karat,
        purity: initialItem.purity,
        autoPurity:
          initialItem.metal === "gold" &&
          Math.abs(initialItem.purity - initialItem.karat / 24) < 0.0001,
        testMethod: initialItem.testMethod ?? "",
        notes: initialItem.notes ?? "",
        weightGrams: initialItem.weightGrams.toString(),
        stoneWeightGrams: initialItem.stoneWeightGrams?.toString() ?? "",
        lineFees: (initialItem.lineFees ?? 0).toString(),
        netWeightGrams: initialItem.netWeightGrams,
        fineGoldGrams: initialItem.fineGoldGrams,
        linePayout: initialItem.linePayout,
      });
    } else {
      setValues({
        type: "",
        metal: "gold",
        karat: 24,
        purity: 1,
        autoPurity: true,
        testMethod: "",
        notes: "",
        weightGrams: "",
        stoneWeightGrams: "",
        lineFees: "",
        netWeightGrams: 0,
        fineGoldGrams: 0,
        linePayout: 0,
      });
    }
  }, [initialItem, open]);

  const computedPurity = useMemo(() => {
    if (values.metal === "gold" && values.autoPurity) {
      return Number((values.karat / 24).toFixed(4));
    }
    return Number(values.purity || 0);
  }, [values.karat, values.metal, values.autoPurity, values.purity]);

  useEffect(() => {
    const weight = Number(values.weightGrams) || 0;
    const stoneWeight = Number(values.stoneWeightGrams) || 0;
    const netWeight = Math.max(weight - stoneWeight, 0);
    const fineGold = netWeight * computedPurity;
    const livePrice = Number(pricing.livePricePerGram24k) || 0;
    const buyRate = Number(pricing.buyRate) || 0;
    const lineFees = Number(values.lineFees) || 0;
    const gross = fineGold * livePrice * buyRate;
    const payout = Math.max(gross - lineFees, 0);

    setValues((prev) => ({
      ...prev,
      netWeightGrams: Number(netWeight.toFixed(3)),
      fineGoldGrams: Number(fineGold.toFixed(3)),
      linePayout: Number(payout.toFixed(2)),
    }));
  }, [
    values.weightGrams,
    values.stoneWeightGrams,
    computedPurity,
    values.lineFees,
    pricing.livePricePerGram24k,
    pricing.buyRate,
  ]);

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload = deriveGoldBuyItem(
      {
        type: values.type.trim(),
        metal: values.metal,
        karat: values.metal === "gold" ? Number(values.karat) : undefined,
        purity: values.metal === "gold" && values.autoPurity ? undefined : computedPurity,
        testMethod: values.testMethod.trim() || undefined,
        notes: values.notes.trim() || undefined,
        weightGrams: Number(values.weightGrams) || 0,
        stoneWeightGrams: Number(values.stoneWeightGrams) || 0,
        lineFees: Number(values.lineFees) || 0,
      },
      initialItem?._localId ?? initialItem?.id,
      pricing
    );

    const enriched: GoldBuyItemDraft = {
      ...payload,
      _localId: initialItem?._localId ?? payload.id ?? createLocalId(),
    };

    onSave(enriched);
    onClose();
  };

  const isValid =
    values.type.trim().length > 0 &&
    Number(values.weightGrams) > 0 &&
    computedPurity > 0 &&
    pricing.livePricePerGram24k > 0 &&
    pricing.buyRate > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialItem ? "Edit Item" : "Add Item"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2.5} mt={0.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Item Type"
              value={values.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Metal"
              value={values.metal}
              onChange={(event) => {
                const metal = event.target.value as GoldBuyItem["metal"];
                setValues((prev) => ({
                  ...prev,
                  metal,
                  autoPurity: metal === "gold" ? prev.autoPurity : false,
                  purity: metal === "gold" ? prev.purity : prev.purity || 0.999,
                }));
              }}
              fullWidth
            >
              {metalOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {values.metal === "gold" && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Karat"
                value={values.karat}
                onChange={(event) =>
                  handleFieldChange("karat", Number(event.target.value))
                }
                fullWidth
              >
                {goldKaratOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}K
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Purity"
                type="number"
                value={values.autoPurity ? computedPurity : values.purity}
                onChange={(e) => handleFieldChange("purity", Number(e.target.value))}
                fullWidth
                disabled={values.metal === "gold" && values.autoPurity}
                inputProps={{ min: 0, max: 1, step: 0.0001 }}
              />
              {values.metal === "gold" && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.autoPurity}
                      onChange={(event) => handleFieldChange("autoPurity", event.target.checked)}
                    />
                  }
                  label="Auto"
                />
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Test Method"
              value={values.testMethod}
              onChange={(e) => handleFieldChange("testMethod", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Total Weight (g)"
              type="number"
              value={values.weightGrams}
              onChange={(e) => handleFieldChange("weightGrams", e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.001 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Stone Weight (g)"
              type="number"
              value={values.stoneWeightGrams}
              onChange={(e) => handleFieldChange("stoneWeightGrams", e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.001 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Net Weight (g)"
              value={values.netWeightGrams}
              disabled
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Fine Gold (g)"
              value={values.fineGoldGrams}
              disabled
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Line Fees ($)"
              type="number"
              value={values.lineFees}
              onChange={(e) => handleFieldChange("lineFees", e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Line Payout ($)"
              value={values.linePayout}
              disabled
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Notes"
              value={values.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box
          mt={3}
          p={2}
          borderRadius={2}
          bgcolor={theme.palette.mode === "light" ? theme.palette.grey[50] : theme.palette.grey[900]}
          border={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="body2" color="text.secondary">
            Live price ${Number(pricing.livePricePerGram24k).toFixed(2)} × buy rate{" "}
            {(Number(pricing.buyRate) * 100).toFixed(2)}% → Line payout ${values.linePayout.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isValid}
          sx={{ textTransform: "none" }}
        >
          Save Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
