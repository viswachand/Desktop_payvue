import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import type { Sale } from "@payvue/shared/types/sale";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface Props {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onRefund: (id: string) => void;
}

export default function SaleHistoryTable({ sales, onView, onRefund }: Props) {
  const theme = useTheme();
  const isAdmin = useSelector(
    (state: RootState) => state.auth.currentUser?.isAdmin ?? false
  );

  const safeSales = React.useMemo(
    () =>
      sales.map((s) => ({
        ...s,
        customerInformation: s.customerInformation ?? {},
      })),
    [sales]
  );

  const columns: GridColDef<Sale>[] = [
    { field: "invoiceNumber", headerName: "Invoice #", flex: 1.3 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.7,
      valueGetter: (value, row) => {
        const date = row.createdAt ? new Date(row.createdAt) : null;
        return date ? date.toLocaleDateString() : "-";
      },
    },
    {
      field: "customerInformation",
      headerName: "Customer",
      flex: 1,
      valueGetter: (value, row) => `${row.customerInformation?.firstName ?? ""}`,
    },
    {
      field: "customerPhone",
      headerName: "Phone",
      flex: 1,
      valueGetter: (value, row) => `${row.customerInformation?.phone ?? ""}`,
    },
    { field: "saleType", headerName: "Type", flex: 0.7 },
    { field: "total", headerName: "Total ($)", flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<Sale>) => (
        <Chip
          label={params.row.status ?? "—"}
          color={
            params.row.status === "paid"
              ? "success"
              : params.row.status === "pending"
              ? "warning"
              : params.row.status === "refunded"
              ? "default"
              : "info"
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
      renderCell: (params: GridRenderCellParams<Sale>) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="View Details">
              <IconButton
                color="primary"
                onClick={() => onView(row)}
                size="small"
              >
                <RemoveRedEyeRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && !row.isRefund && (
              <Tooltip title="Refund Sale">
                <IconButton
                  color="error"
                  onClick={() => onRefund(row.id ?? "")}
                  size="small"
                >
                  <CurrencyExchangeRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid<Sale>
        rows={safeSales}
        columns={columns}
        disableColumnMenu
        getRowId={(r) =>
          r.id || r.invoiceNumber || `${r.createdAt}-${Math.random()}`
        }
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        rowHeight={70}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        onCellClick={(params, event) => {
          event.stopPropagation();
        }}
      />
    </Box>
  );
}
