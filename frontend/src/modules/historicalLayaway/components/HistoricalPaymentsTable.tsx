import * as React from "react";
import { Box, Button, TextField, useTheme, Select, Stack, Typography } from "@/components/common";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Installment {
  amount?: number;
  method?: string;
  paidAt?: string;
}

interface Props {
  installments: Installment[];
  onChange: (updated: Installment[]) => void;
  totalAmount: number;
}

export default function HistoricalPaymentsTable({
  installments,
  onChange,
  totalAmount,
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [newPayment, setNewPayment] = React.useState<Installment>({
    amount: undefined,
    method: "",
    paidAt: "",
  });

  const totalPaid = React.useMemo(
    () => installments.reduce((sum, i) => sum + (i.amount ?? 0), 0),
    [installments]
  );

  const rows = React.useMemo(
    () =>
      (installments || []).map((i, idx) => ({
        id: idx,
        ...i,
      })),
    [installments]
  );

  const columns: GridColDef[] = [
    {
      field: "paidAt",
      headerName: "Paid Date",
      flex: 1,
      valueGetter: (_, r) =>
        r.paidAt
          ? new Date(r.paidAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      field: "method",
      headerName: "Payment Method",
      flex: 1,
      valueGetter: (_, r) => r.method || "—",
    },
    {
      field: "amount",
      headerName: "Amount ($)",
      flex: 1,
      valueGetter: (_, r) =>
        r.amount != null ? Number(r.amount).toFixed(2) : "-",
    },
  ];

  const handleAddPayment = () => {
    setError("");
    const entered = newPayment.amount ?? 0;
    const newTotal = totalPaid + entered;

    if (newTotal > totalAmount) {
      setError(
        `Total payments ($${newTotal.toFixed(
          2
        )}) cannot exceed sale total ($${totalAmount.toFixed(2)}).`
      );
      return;
    }

    onChange([...installments, newPayment]);
    setOpen(false);
    setNewPayment({
      amount: undefined,
      method: "",
      paidAt: "",
    });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Payments cannot exceed the sale total of ${totalAmount.toFixed(2)}.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ textTransform: "none" }}
        >
          Add Payment
        </Button>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: 360,
          "& .MuiDataGrid-root": { width: "100%" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[100],
          },
          "& .MuiDataGrid-cell": {
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          disableColumnMenu
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          rowHeight={64}
          density="comfortable"
          sx={{ width: "100%" }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="body2" color="text.secondary">
          {rows.length} {rows.length === 1 ? "payment" : "payments"}
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>
          Paid ${totalPaid.toFixed(2)}
        </Typography>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Historical Payment</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField
              label="Amount ($)"
              type="number"
              value={newPayment.amount ?? ""}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  amount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              fullWidth
            />

            <Select
              label="Payment Method"
              value={newPayment.method}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  method: e.target.value,
                })
              }
              options={[
                { value: "", label: "Select Method" },
                { value: "cash", label: "Cash" },
                { value: "card", label: "Card" },
                { value: "mixed", label: "Mixed" },
                { value: "others", label: "Others" },
              ]}
              fullWidth
            />

            <TextField
              label="Paid Date"
              type="date"
              value={newPayment.paidAt || ""}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  paidAt: e.target.value,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddPayment}
            variant="contained"
            color="primary"
            disabled={!newPayment.amount || !newPayment.method || !newPayment.paidAt}
          >
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
