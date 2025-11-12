import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteRounded, VisibilityRounded } from "@mui/icons-material";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import DeleteSaleDialog from "./DeleteSaleDialog";

interface ReportTableProps {
  rows: any[];
  onDelete: (id: string) => Promise<void> | void;
}

export default function ReportTable({ rows, onDelete }: ReportTableProps) {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteInvoice, setDeleteInvoice] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (row: any) => {
    setDeleteId(row.id);
    setDeleteInvoice(row.invoiceNumber);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await onDelete(deleteId);
    } finally {
      setLoading(false);
      setDeleteId(null);
      setDeleteInvoice(undefined);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setDeleteId(null);
    setDeleteInvoice(undefined);
  };

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "Invoice #", flex: 1.2 },

    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.9,
      valueGetter: (_, row) => {
        if (!row.createdAt) return "-";
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-US");
      },
    },

    {
      field: "customerInformation",
      headerName: "Customer",
      flex: 1.3,
      valueGetter: (_, row) => {
        const info = row.customerInformation || {};
        const name = `${info.firstName ?? ""} ${info.lastName ?? ""}`.trim();
        return name || "-";
      },
    },

    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      valueGetter: (_, row) =>
        row.customerInformation?.phone
          ? formatPhoneNumber(row.customerInformation.phone)
          : "-",
    },

    // { field: "saleType", headerName: "Type", flex: 0.8 },

    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 0.9,
      valueGetter: (_, row) =>
        row.subtotal?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) ?? "$0.00",
    },
    // { field: "tax", headerName: "Tax", flex: 0.8 },

    {
      field: "discountTotal",
      headerName: "Discount",
      flex: 0.9,
      valueGetter: (_, row) =>
        row.discountTotal?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) ?? "$0.00",
    },

    {
      field: "total",
      headerName: "Total ($)",
      flex: 0.9,
      valueGetter: (_, row) =>
        row.total?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) ?? "$0.00",
    },

    {
      field: "paidAmount",
      headerName: "Paid ($)",
      flex: 0.9,
      valueGetter: (_, row) =>
        row.paidAmount?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) ?? "$0.00",
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.status ?? "—"}
          color={
            params.row.status === "paid"
              ? "success"
              : params.row.status === "pending"
              ? "warning"
              : params.row.status === "installment"
              ? "info"
              : params.row.status === "refunded"
              ? "default"
              : "primary"
          }
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => navigate(`/payment/${params.row.id}`)}
              size="small"
            >
              <VisibilityRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Sale">
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              size="small"
            >
              <DeleteRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        getRowId={(r) => r.id || r.invoiceNumber}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        rowHeight={80}
      />

      <DeleteSaleDialog
        open={Boolean(deleteId)}
        invoiceNumber={deleteInvoice}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </Box>
  );
}
