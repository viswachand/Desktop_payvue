import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import { useNavigate } from "react-router-dom";
import type { Sale } from "@payvue/shared/types/sale";

interface Props {
  layaways: Sale[];
}

export default function LayawayTable({ layaways }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  // 🧠 Prevent null references
  const safeLayaways = React.useMemo(
    () =>
      layaways.map((l) => ({
        ...l,
        customerInformation: l.customerInformation ?? {},
      })),
    [layaways]
  );

  const columns: GridColDef<Sale>[] = [
    {
      field: "invoiceNumber",
      headerName: "Invoice #",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.9,
      minWidth: 130,
      valueGetter: (value, row) => {
        const date = row.createdAt ? new Date(row.createdAt) : null;
        return date ? date.toLocaleDateString() : "-";
      },
    },
    {
      field: "customerInformation",
      headerName: "Customer",
      flex: 1.3,
      minWidth: 180,
      valueGetter: (value, row) =>
        `${row.customerInformation?.firstName ?? ""} ${
          row.customerInformation?.lastName ?? ""
        }`,
    },
    {
      field: "customerPhone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.customerInformation?.phone ?? "",
    },
    {
      field: "total",
      headerName: "Total ($)",
      flex: 0.8,
      minWidth: 110,
      valueGetter: (value, row) => `$${Number(row.total ?? 0).toFixed(2)}`,
    },
    {
      field: "balanceAmount",
      headerName: "Remaining ($)",
      flex: 0.9,
      minWidth: 120,
      valueGetter: (value, row) =>
        `$${Number(row.balanceAmount ?? 0).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<Sale>) => {
        const status = params.row.balanceAmount === 0 ? "Completed" : "Active";
        return (
          <Chip
            label={status}
            color={status === "Completed" ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      filterable: false,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<Sale>) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="View Details">
              <IconButton
                color="primary"
                onClick={() => navigate(`/payment/${row.id}`)}
                size="small"
              >
                <RemoveRedEyeRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add Payment">
              <IconButton color="success" size="small">
                <CurrencyExchangeRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Print Receipt">
              <IconButton color="secondary" size="small">
                <LocalPrintshopRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid<Sale>
        rows={safeLayaways}
        columns={columns}
        getRowId={(r) =>
          r.id || r.invoiceNumber || `${r.createdAt}-${Math.random()}`
        }
        disableRowSelectionOnClick
        disableColumnMenu
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        onCellClick={(params, event) => {
          event.stopPropagation();
        }}
        pageSizeOptions={[10, 25, 50]}
        rowHeight={70}
        density="compact"
      />
    </Box>
  );
}
