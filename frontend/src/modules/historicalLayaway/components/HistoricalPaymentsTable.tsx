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
  const [dialogMode, setDialogMode] = React.useState<"add" | "edit">("add");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const createEmptyPayment = (): Installment => ({
    amount: undefined,
    method: "",
    paidAt: "",
  });

  const [newPayment, setNewPayment] =
    React.useState<Installment>(createEmptyPayment());

  const formatDateForDisplay = (value?: string) => {
    if (!value) return "-";
    const date = value.includes("T")
      ? new Date(value)
      : new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dateValueForInput = (value?: string) => {
    if (!value) return "";
    if (value.includes("T")) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
    }
    return value.slice(0, 10);
  };

  const paymentMethodLabels: Record<string, string> = {
    cash: "Cash",
    credit: "Credit Card",
    debit: "Debit Card",
    mixed: "Mixed",
    others: "Others",
  };

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

  const handleCloseDialog = () => {
    setOpen(false);
    setDialogMode("add");
    setEditingIndex(null);
    setError("");
    setNewPayment(createEmptyPayment());
  };

  const handleOpenAdd = () => {
    setDialogMode("add");
    setEditingIndex(null);
    setNewPayment(createEmptyPayment());
    setOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    const installment = installments[index];
    if (!installment) return;
    setDialogMode("edit");
    setEditingIndex(index);
    setNewPayment({
      amount: installment.amount,
      method: installment.method,
      paidAt: dateValueForInput(installment.paidAt),
    });
    setOpen(true);
  };

  const handleSavePayment = () => {
    setError("");
    const entered = newPayment.amount ?? 0;
    const baseTotal =
      dialogMode === "edit" && editingIndex !== null
        ? totalPaid - (installments[editingIndex]?.amount ?? 0)
        : totalPaid;
    const newTotal = baseTotal + entered;

    if (newTotal > totalAmount) {
      setError(
        `Total payments ($${newTotal.toFixed(
          2
        )}) cannot exceed sale total ($${totalAmount.toFixed(2)}).`
      );
      return;
    }

    const payload: Installment = {
      amount: newPayment.amount,
      method: newPayment.method,
      paidAt: newPayment.paidAt,
    };

    const updated =
      dialogMode === "edit" && editingIndex !== null
        ? installments.map((inst, idx) =>
            idx === editingIndex ? { ...payload } : inst
          )
        : [...installments, { ...payload }];

    onChange(updated);
    handleCloseDialog();
  };

  const columns: GridColDef[] = [
    {
      field: "paidAt",
      headerName: "Paid Date",
      flex: 1,
      valueGetter: (_, r) => formatDateForDisplay(r.paidAt),
    },
    {
      field: "method",
      headerName: "Payment Method",
      flex: 1,
      valueGetter: (_, r) =>
        r.method ? paymentMethodLabels[r.method] ?? r.method : "—",
    },
    {
      field: "amount",
      headerName: "Amount ($)",
      flex: 1,
      valueGetter: (_, r) =>
        r.amount != null ? Number(r.amount).toFixed(2) : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.9,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            onClick={() => handleOpenEdit(params.row.id)}
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Payments cannot exceed the sale total of ${totalAmount.toFixed(2)}.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAdd}
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
          onRowDoubleClick={(params) => {
            const rowIndex = Number(params.row?.id);
            if (!Number.isNaN(rowIndex)) {
              handleOpenEdit(rowIndex);
            }
          }}
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

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === "edit"
            ? "Edit Historical Payment"
            : "Add Historical Payment"}
        </DialogTitle>
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
                { value: "credit", label: "Credit Card" },
                { value: "debit", label: "Debit Card" },
                { value: "mixed", label: "Mixed" },
                { value: "others", label: "Others" },
              ]}
              fullWidth
            />

            <TextField
              label="Paid Date"
              type="date"
              value={newPayment.paidAt ? dateValueForInput(newPayment.paidAt) : ""}
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
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSavePayment}
            variant="contained"
            color="primary"
            disabled={!newPayment.amount || !newPayment.method || !newPayment.paidAt}
          >
            {dialogMode === "edit" ? "Save Changes" : "Add Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
