import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useNavigate } from "react-router-dom"; 
import type { Item } from "@payvue/shared/types/item";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface Props {
  items: Item[];
}

export default function InventoryTable({ items }: Props) {
  const theme = useTheme();
  const navigate = useNavigate(); // ✅ navigation hook

  const [deleteItem, setDeleteItem] = React.useState<Item | null>(null);

  const rows = React.useMemo(
    () =>
      (items || []).map((item) => ({
        id: item.id || item.id,
        sku: item.itemSKU ?? "—",
        name: item.itemName ?? "—",
        description: item.itemDescription ?? "-",
        category:
          typeof item.itemCategory === "object" && item.itemCategory !== null
            ? (item.itemCategory as any).name ?? "—"
            : item.itemCategory ?? "—",
        quantity: item.quantity ?? 0,
        unitPrice: Number(item.unitPrice || 0),
        totalValue: Number(item.unitPrice || 0) * Number(item.quantity || 0),
        status: item.isSold ? "Sold" : "In Stock",
        raw: item,
      })),
    [items]
  );

  const columns: GridColDef[] = [
    { field: "sku", headerName: "SKU", flex: 0.8 },
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "description", headerName: "Item Description", flex: 1.5 },
    { field: "category", headerName: "Category", flex: 0.7 },
    {
      field: "quantity",
      headerName: "Qty",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unitPrice",
      headerName: "Unit Price ($)",
      flex: 1,
      valueGetter: (_, r) => r.unitPrice.toFixed(2),
    },
    {
      field: "totalValue",
      headerName: "Total Value ($)",
      flex: 1,
      valueGetter: (_, r) => r.totalValue.toFixed(2),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.status}
          color={params.row.status === "Sold" ? "warning" : "success"}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit Item">
            <IconButton
              size="small"
              onClick={() => navigate(`/inventory/addItem/${params.row.id}`)} // ✅ Navigate to edit page
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Item">
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteItem(params.row.raw)}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
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
        disableColumnMenu
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        rowHeight={70}
        density="compact"
      />

      {/* Delete Dialog */}
      {deleteItem && (
        <DeleteConfirmDialog
          open={!!deleteItem}
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </Box>
  );
}
