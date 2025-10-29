import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Chip,
  LinearProgress,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Box,
  Typography,
  Divider,
  Button,
  useTheme,
  Card,
} from "@/components/common";
import {
  ArrowBack,
  AddCircleRounded,
  Person,
  ReceiptLongRounded,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  fetchSaleById,
  selectCurrentSale,
  selectSaleLoading,
} from "@/features/sales/saleSlice";
import AddPaymentDialog from "../modules/layaway/components/AddPaymentDialog";
import PaymentHistoryTable from "../modules/layaway/components/InstallmentTable";
import SaleReceiptDialog from "@/modules/receipts/SaleReceiptDialog";
import type { Sale } from "@payvue/shared/types/sale";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const sale = useSelector(selectCurrentSale) as Sale | null;
  const loading = useSelector(selectSaleLoading);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchSaleById(id));
  }, [id, dispatch]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!sale)
    return (
      <Box p={4}>
        <Typography variant="h6" color="text.secondary">
          Payment details not found.
        </Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Box>
    );

  const {
    invoiceNumber,
    createdAt,
    customerInformation,
    installments = [],
    total = 0,
    paidAmount = 0,
    balanceAmount = 0,
    isLayaway,
  } = sale;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const progress = total > 0 ? Math.min((paidAmount / total) * 100, 100) : 0;


  const statusLabel =
    balanceAmount === 0
      ? "Completed"
      : balanceAmount < total
      ? "Active"
      : "Pending";
  const statusColor =
    balanceAmount === 0
      ? "success"
      : balanceAmount < total
      ? "warning"
      : "info";

  return (
    <Box sx={{ p: 5, background: theme.palette.background.default }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Payment Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Invoice #{invoiceNumber} • Created on {formattedDate}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={8}>
          <Card
            title="Payment Summary"
            subheader="Customer and payment details"
            sx={{ mb: 2 }}
          >
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Person color="primary" />
                  <Box>
                    <Typography fontWeight={600}>
                      {customerInformation?.firstName ?? "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customerInformation?.phone ?? "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customerInformation?.email ?? "—"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBalanceWallet color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography fontWeight={600}>{formatCurrency(total)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paid: {formatCurrency(paidAmount)}
                    </Typography>
                    <Typography variant="body2" color="error">
                      Remaining: {formatCurrency(balanceAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mb: 1,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          progress === 100
                            ? theme.palette.success.main
                            : theme.palette.primary.main,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {progress.toFixed(0)}% paid
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card title="Payment History" subheader="All previous installments">
            <PaymentHistoryTable installments={installments} />
          </Card>
        </Grid>

        <Grid size={4}>
          <Card title="Customer Status">
            <Box display="flex" flexDirection="column" gap={2}>
              <Chip
                label={statusLabel}
                color={statusColor as any}
                sx={{ width: "fit-content", fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                Invoice #: {invoiceNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created on {formattedDate}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">Actions</Typography>

              {isLayaway && balanceAmount > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleRounded />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  Add Payment
                </Button>
              )}

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ReceiptLongRounded />}
                onClick={() => setReceiptOpen(true)}
              >
                View Invoice
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {isLayaway && (
        <AddPaymentDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          layawayId={sale.id}
          balanceAmount={balanceAmount}
          onSuccess={() => dispatch(fetchSaleById(id!))}
        />
      )}

      <SaleReceiptDialog
        sale={receiptOpen ? sale : null}
        onClose={() => setReceiptOpen(false)}
      />
    </Box>
  );
}
