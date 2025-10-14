import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  useTheme,
  Paper,
} from "@/components/common";
import { CircularProgress, LinearProgress, Chip } from "@mui/material";
import { ArrowBack, PrintRounded, AddCircleRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  fetchLayawayById,
  selectCurrentLayaway,
  selectLayawayLoading,
} from "@/features/layaway/layawaySlice";
import AddPaymentDialog from "../components/AddPaymentDialog";
import PaymentHistoryTable from "../components/InstallmentTable";
import type { Sale } from "@payvue/shared/types/sale";

export default function LayawayDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const layaway = useSelector(selectCurrentLayaway) as Sale | null;
  const loading = useSelector(selectLayawayLoading);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchLayawayById(id));
  }, [id, dispatch]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!layaway)
    return (
      <Box p={4}>
        <Typography variant="h6" color="text.secondary">
          Layaway not found.
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
    items = [],
    installments = [],
    total = 0,
    paidAmount = 0,
    balanceAmount = 0,
  } = layaway;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const progress = total > 0 ? Math.min((paidAmount / total) * 100, 100) : 0;
  const formatCurrency = (v: number) =>
    `$${(v ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

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
    <Box sx={{ p: 5, backgroundColor: theme.palette.background.default }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Layaway #{invoiceNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created on {formattedDate}
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
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleRounded />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Payment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PrintRounded />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Row Layout */}
      <Grid container spacing={2} mb={3}>
        {/* Customer Info */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              CUSTOMER INFO
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {customerInformation?.firstName ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customerInformation?.phone ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customerInformation?.email ?? "—"}
            </Typography>

            <Box mt={2}>
              <Chip
                label={statusLabel}
                color={statusColor as any}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Payment Summary */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              PAYMENT SUMMARY
            </Typography>
            <Typography variant="body1" mt={1}>
              Total: <strong>{formatCurrency(total)}</strong>
            </Typography>
            <Typography variant="body1">
              Paid: <strong>{formatCurrency(paidAmount)}</strong>
            </Typography>
            <Typography variant="body1" color="error">
              Remaining: <strong>{formatCurrency(balanceAmount)}</strong>
            </Typography>

            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
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
          </Paper>
        </Grid>

        {/* Items Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              ITEMS
            </Typography>
            <Divider sx={{ mb: 2, mt: 1 }} />
            {items.length > 0 ? (
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: theme.palette.grey[100],
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: 10 }}>Item</th>
                      <th style={{ padding: 10 }}>Qty</th>
                      <th style={{ padding: 10 }}>Price</th>
                      <th style={{ padding: 10 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <td style={{ padding: 10 }}>{it.name}</td>
                        <td style={{ padding: 10 }}>{it.quantity}</td>
                        <td style={{ padding: 10 }}>
                          {formatCurrency(it.costPrice)}
                        </td>
                        <td style={{ padding: 10 }}>
                          {formatCurrency(it.costPrice * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No items found.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <PaymentHistoryTable installments={installments} />

      <AddPaymentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        layawayId={layaway.id}
        onSuccess={(updated) => console.log("Updated:", updated)}
        balanceAmount={balanceAmount}
      />
    </Box>
  );
}
