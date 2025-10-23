import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, TextField, Button, Snackbar, useTheme } from "@/components/common";
import type { AppDispatch } from "@/app/store";
import {
  createGoldBuy,
  selectGoldBuySaving,
  selectGoldBuyError,
  selectGoldBuySuccessMessage,
  clearGoldBuyError,
  clearGoldBuySuccess,
} from "@/features/goldBuy/goldSlice";
import type { GoldBuyItem } from "@payvue/shared/types/goldBuy";
import GoldBuyCustomerCard, { GoldBuyCustomerState } from "../components/GoldBuyCustomerCard";
import GoldBuyPricingCard from "../components/GoldBuyPricingCard";
import GoldBuyItemsEditor, { GoldBuyItemDraft } from "../components/GoldBuyItemsEditor";
import GoldBuyTotalsCard from "../components/GoldBuyTotalsCard";
import { useNavigate } from "react-router-dom";

export default function GoldBuyCreatePage() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isSaving = useSelector(selectGoldBuySaving);
  const error = useSelector(selectGoldBuyError);
  const success = useSelector(selectGoldBuySuccessMessage);

  const [customer, setCustomer] = useState<GoldBuyCustomerState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
  });

  const [pricing, setPricing] = useState({
    livePricePerGram24k: "",
    buyRate: "",
    fees: {
      testFee: "",
      refiningPerGram: "",
    },
  });

  const [items, setItems] = useState<GoldBuyItemDraft[]>([]);
  const [comment, setComment] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (error) {
      setSnackMessage(error);
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setSnackMessage(success);
      setSnackSeverity("success");
      setSnackOpen(true);
      setTimeout(() => navigate("/goldbuy"), 1500);
    }
  }, [success, navigate]);

  const totalsInput = useMemo(
    () => ({
      livePricePerGram24k: Number(pricing.livePricePerGram24k) || 0,
      buyRate: Number(pricing.buyRate) / 100 || 0,
      fees: {
        testFee: Number(pricing.fees.testFee) || 0,
        refiningPerGram: Number(pricing.fees.refiningPerGram) || 0,
      },
    }),
    [pricing]
  );

  const outboundItems: GoldBuyItem[] = useMemo(
    () =>
      items.map((item) => {
        const { _localId, ...rest } = item;
        return {
          ...rest,
          lineFees: item.lineFees ?? 0,
        };
      }),
    [items]
  );

  const isFormValid =
    customer.firstName.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    outboundItems.length > 0 &&
    totalsInput.livePricePerGram24k > 0 &&
    totalsInput.buyRate > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch(
      createGoldBuy({
        customerInformation: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          email: customer.email,
          address1: customer.address1,
          address2: customer.address2,
          city: customer.city,
          state: customer.state,
        },
        items: outboundItems,
        pricing: {
          livePricePerGram24k: totalsInput.livePricePerGram24k,
          buyRate: totalsInput.buyRate,
          fees: {
            testFee: totalsInput.fees.testFee,
            refiningPerGram: totalsInput.fees.refiningPerGram,
          },
        },
        comment: comment.trim() || undefined,
      })
    );
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 3 },
        maxWidth: "100%",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        New Gold Buy Ticket
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Capture customer details, record items, and preview payout in real time before saving.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            mb={3}
            p={{ xs: 2, md: 3 }}
            borderRadius={3}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            boxShadow={theme.customShadows?.card}
          >
            <GoldBuyCustomerCard customer={customer} onChange={setCustomer} />
          </Box>

          <Box
            mb={3}
            p={{ xs: 2, md: 3 }}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            boxShadow={theme.customShadows?.card}
            sx={{
              width:"100%",
              borderRadius:theme.shape.borderRadius,
            }}
          >
            <GoldBuyPricingCard pricing={pricing} onChange={setPricing} />
          </Box>

          <Box
            mb={3}
            p={{ xs: 2, md: 3 }}
            borderRadius={3}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            boxShadow={theme.customShadows?.card}
            sx={{
              width:"100%"
            }}
          >
            <GoldBuyItemsEditor
              items={items}
              onChange={setItems}
              pricing={{
                livePricePerGram24k: totalsInput.livePricePerGram24k,
                buyRate: totalsInput.buyRate,
              }}
            />
          </Box>

          {/* <Box
            mb={3}
            p={{ xs: 2, md: 3 }}
            borderRadius={3}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
          
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Internal Notes
            </Typography>
            <TextField
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              placeholder="Add any special handling instructions or override reasons."
            />
          </Box> */}
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            p={{ xs: 2, md: 3 }}
            borderRadius={3}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            boxShadow={theme.customShadows?.card}
            position={{ lg: "sticky" }}
            top={{ lg: theme.spacing(2) }}
            height="fit-content"
          >
            <GoldBuyTotalsCard items={outboundItems} pricing={totalsInput} />

            <Box display="flex" flexDirection="column" gap={1.5} mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!isFormValid || isSaving}
                sx={{ textTransform: "none" }}
              >
                {isSaving ? "Saving..." : "Save Ticket"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/goldbuy")}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackOpen}
        onClose={() => {
          setSnackOpen(false);
          dispatch(clearGoldBuyError());
          dispatch(clearGoldBuySuccess());
        }}
        message={snackMessage}
        severity={snackSeverity}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
