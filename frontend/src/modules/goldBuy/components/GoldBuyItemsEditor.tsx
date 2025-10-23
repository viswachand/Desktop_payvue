import { useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@/components/common";
import type { GoldBuyItem, GoldBuyPricing } from "@payvue/shared/types/goldBuy";
import GoldBuyItemDialog, { GoldBuyItemDraft } from "./GoldBuyItemDialog";

interface GoldBuyItemsEditorProps {
  items: GoldBuyItemDraft[];
  onChange: (items: GoldBuyItemDraft[]) => void;
  pricing: Pick<GoldBuyPricing, "livePricePerGram24k" | "buyRate">;
}

export default function GoldBuyItemsEditor({
  items,
  onChange,
  pricing,
}: GoldBuyItemsEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GoldBuyItemDraft | null>(null);

  const rows = useMemo(
    () =>
      items.map((item) => ({
        id: item._localId,
        type: item.type,
        metal: item.metal,
        karat: item.karat,
        netWeightGrams: item.netWeightGrams,
        fineGoldGrams: item.fineGoldGrams,
        linePayout: item.linePayout,
      })),
    [items]
  );

  const columns: GridColDef[] = [
    { field: "type", headerName: "Item", flex: 1.1 },
    {
      field: "metal",
      headerName: "Metal",
      flex: 0.7,
      valueGetter: (_, row) => row.metal?.toUpperCase(),
    },
    {
      field: "karat",
      headerName: "Karat",
      flex: 0.6,
      valueGetter: (_, row) => (row.karat ? `${row.karat}K` : "—"),
    },
    {
      field: "netWeightGrams",
      headerName: "Net (g)",
      flex: 0.7,
      valueGetter: (_, row) => row.netWeightGrams?.toFixed(3),
    },
    {
      field: "fineGoldGrams",
      headerName: "Fine (g)",
      flex: 0.7,
      valueGetter: (_, row) => row.fineGoldGrams?.toFixed(3),
    },
    {
      field: "linePayout",
      headerName: "Payout ($)",
      flex: 0.8,
      valueGetter: (_, row) => row.linePayout?.toFixed(2),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const target = items.find((item) => item._localId === id);
    if (target) {
      setEditingItem(target);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item._localId !== id));
  };

  const handleSave = (item: GoldBuyItemDraft) => {
    const exists = items.some((i) => i._localId === item._localId);
    if (exists) {
      onChange(items.map((i) => (i._localId === item._localId ? item : i)));
    } else {
      onChange([...items, item]);
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Items
        </Typography>
        <Button variant="contained" onClick={handleAdd} sx={{ textTransform: "none" }}>
          Add Item
        </Button>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: 340,
          "& .MuiDataGrid-root": { width: "100%" },
        }}
      >
        <DataGrid
          rows={rows}
          columns={[
            ...columns,
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              flex: 0.9,
              renderCell: (params) => (
                <Stack direction="row" gap={1}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleEdit(params.id as string)}
                    sx={{ textTransform: "none" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.id as string)}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                </Stack>
              ),
            },
          ]}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          density="comfortable"
          getRowHeight={() => 56}
          onRowDoubleClick={(params) => handleEdit(params.id as string)}
        />
      </Box>

      <GoldBuyItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        pricing={pricing}
        initialItem={editingItem}
      />
    </>
  );
}

export type { GoldBuyItemDraft } from "./GoldBuyItemDialog";
