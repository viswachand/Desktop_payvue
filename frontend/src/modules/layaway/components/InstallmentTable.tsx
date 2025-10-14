import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, Typography } from "@mui/material";
import { Box, useTheme } from "@/components/common";
import type { Installment } from "@payvue/shared/types/sale";

interface Props {
  installments: Installment[];
}

export default function PaymentHistoryTable({ installments }: Props) {
  const theme = useTheme();

  const rows = React.useMemo(
    () =>
      (installments || []).map((i, idx) => ({
        id: idx,
        amount: Number(i.amount || 0),
        method: i.method ?? "—",
        paidAt: i.paidAt ? new Date(i.paidAt) : null,
        status: Number(i.amount || 0) > 0 ? "Paid" : "Pending",
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
      valueGetter: (_, r) => r.amount.toFixed(2),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.status}
          color={params.row.status === "Paid" ? "success" : "warning"}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Payment History
      </Typography>

      <Box
        sx={{
          height: 400,
          width: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[100],
            borderRadius: 0,
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
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          rowHeight={100}
          pageSizeOptions={[5, 10]}
          density="compact"
          sx={{
            borderTop: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[100],
              borderRadius: 0,
            },
            "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader, \
               & .MuiDataGrid-row--borderBottom .MuiDataGrid-filler, \
               & .MuiDataGrid-row--borderBottom .MuiDataGrid-scrollbarFiller": {
              borderBottom: "0 !important",
              borderTop: "0 !important",
              backgroundColor: theme.palette.grey[100],
            },
          }}
        />
      </Box>
    </Box>
  );
}
