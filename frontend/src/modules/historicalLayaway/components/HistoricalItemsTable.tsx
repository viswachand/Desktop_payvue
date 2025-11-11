import * as React from "react";
import { Box, Button, TextField, useTheme, Select, Stack, Typography } from "@/components/common";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Item {
  name: string;
  type: string;
  quantity: number;
  costPrice?: number;
  discount?: number;
}

interface Props {
  items: Item[];
  onChange: (updated: Item[], totalAmount: number) => void;
}

export default function HistoricalItemsTable({ items, onChange }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"add" | "edit">("add");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const createEmptyItem = (): Item => ({
    name: "",
    type: "inventory",
    quantity: 1,
    costPrice: undefined,
    discount: undefined,
  });

  const [newItem, setNewItem] = React.useState<Item>(createEmptyItem());

  const rows = React.useMemo(() => {
    return (items || []).map((i, idx) => ({
      id: idx,
      ...i,
      total:
        (Number(i.quantity || 0) * Number(i.costPrice || 0)) -
        Number(i.discount || 0),
    }));
  }, [items]);

  const totalAmount = React.useMemo(() => {
    return rows.reduce((sum, r) => sum + (r.total || 0), 0);
  }, [rows]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 0.9 },
    { field: "quantity", headerName: "Qty", flex: 0.5 },
    {
      field: "costPrice",
      headerName: "Price ($)",
      flex: 0.8,
      valueGetter: (_, r) => r.costPrice?.toFixed(2) ?? "-",
    },
    {
      field: "discount",
      headerName: "Discount ($)",
      flex: 0.8,
      valueGetter: (_, r) => r.discount?.toFixed(2) ?? "-",
    },
    {
      field: "total",
      headerName: "Total ($)",
      flex: 0.9,
      valueGetter: (_, r) => (r.total ? r.total.toFixed(2) : "0.00"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
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

  const handleCloseDialog = () => {
    setOpen(false);
    setDialogMode("add");
    setEditingIndex(null);
    setNewItem(createEmptyItem());
  };

  const handleOpenAdd = () => {
    setDialogMode("add");
    setEditingIndex(null);
    setNewItem(createEmptyItem());
    setOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    const item = items[index];
    if (!item) return;
    setDialogMode("edit");
    setEditingIndex(index);
    setNewItem({ ...item });
    setOpen(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.costPrice) return;

    let updatedItems: Item[];
    if (dialogMode === "edit" && editingIndex !== null) {
      updatedItems = items.map((item, idx) =>
        idx === editingIndex ? { ...newItem } : item
      );
    } else {
      updatedItems = [...items, { ...newItem }];
    }

    const updatedTotal = updatedItems.reduce(
      (sum, i) =>
        sum +
        (Number(i.quantity || 0) * Number(i.costPrice || 0) -
          Number(i.discount || 0)),
      0
    );

    onChange(updatedItems, updatedTotal);
    handleCloseDialog();
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAdd}
          sx={{ textTransform: "none" }}
        >
          Add Item
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
          "& .MuiDataGrid-cell": { alignItems: "center" },
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
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Typography variant="body2" color="text.secondary">
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>
          ${totalAmount.toFixed(2)}
        </Typography>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === "edit" ? "Edit Historical Item" : "Add Historical Item"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField
              label="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
            />

            <Select
              label="Item Type"
              value={newItem.type}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  type: e.target.value,
                })
              }
              options={[
                { value: "inventory", label: "Inventory" },
                { value: "custom", label: "Custom" },
                { value: "service", label: "Service" },
                { value: "repair", label: "Repair" },
                { value: "gold_buy", label: "Gold Buy" },
              ]}
              fullWidth
            />

            <TextField
              label="Quantity"
              type="number"
              value={newItem.quantity || ""}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: Number(e.target.value) || 0,
                })
              }
              fullWidth
            />

            <TextField
              label="Price ($)"
              type="number"
              value={newItem.costPrice ?? ""}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  costPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              fullWidth
            />

            <TextField
              label="Discount ($)"
              type="number"
              value={newItem.discount ?? ""}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  discount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            color="primary"
            disabled={!newItem.name || !newItem.costPrice}
          >
            {dialogMode === "edit" ? "Save Changes" : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
