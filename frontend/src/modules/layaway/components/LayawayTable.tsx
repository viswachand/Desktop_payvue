import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { useNavigate } from "react-router-dom";
import type { Sale } from "@payvue/shared/types/sale";

interface Props {
  layaways: Sale[];
  actions?: { addPayment?: boolean; print?: boolean };
}

export default function LayawayTable({ layaways, actions }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const safeLayaways = React.useMemo(
    () =>
      layaways.map((l) => ({
        ...l,
        customerInformation: l.customerInformation ?? {},
      })),
    [layaways]
  );

  const handleView = React.useCallback(
    (id?: string) => {
      if (!id) return;
      navigate(`/payment/${id}`);
    },
    [navigate]
  );

  const showAddPayment = actions?.addPayment ?? false;
  const showPrint = actions?.print ?? false;

  const columns: GridColDef<Sale>[] = React.useMemo(
    () => [
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
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<Sale>) => {
          const row = params.row;
          return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Tooltip title="View Details">
                <IconButton
                  color="primary"
                  onClick={() => handleView(row.id)}
                  size="small"
                >
                  <RemoveRedEyeRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {showAddPayment ? (
                <Tooltip title="Add Payment">
                  <IconButton color="success" size="small" onClick={() => {}}>
                    {/* placeholder for payment handler if enabled */}
                    <></>
                  </IconButton>
                </Tooltip>
              ) : null}

              {showPrint ? (
                <Tooltip title="Print Receipt">
                  <IconButton color="secondary" size="small" onClick={() => {}}>
                    {/* placeholder for print handler if enabled */}
                    <></>
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          );
        },
      },
    ],
    [handleView, showAddPayment, showPrint]
  );

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid<Sale>
        rows={safeLayaways}
        columns={columns}
        getRowId={(r) => r.id ?? r.invoiceNumber ?? String(r.createdAt ?? "")}
        disableRowSelectionOnClick
        disableColumnMenu
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        onCellClick={(params, event) => event.stopPropagation()}
        pageSizeOptions={[10, 25, 50]}
        rowHeight={70}
        density="compact"
      />
    </Box>
  );
}
