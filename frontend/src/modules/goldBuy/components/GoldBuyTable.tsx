import { useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";
import { goldBuyStatuses } from "@/utils/goldBuy";
import type { GoldBuy } from "@payvue/shared/types/goldBuy";

interface GoldBuyTableProps {
  records: GoldBuy[];
  loading: boolean;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onNew: () => void;
  onRowClick: (ticket: GoldBuy) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function GoldBuyTable({
  records,
  loading,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onNew,
  onRowClick,
}: GoldBuyTableProps) {
  const theme = useTheme();

  const filtered = useMemo(() => {
    return records.filter((ticket) => {
      const matchesSearch =
        ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        `${ticket.customerInformation.firstName} ${ticket.customerInformation.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = status === "all" || ticket.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, status]);

  const columns: GridColDef[] = [
    { field: "ticketNumber", headerName: "Ticket", flex: 1 },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1.2,
      valueGetter: (_, row) =>
        `${row.customerInformation.firstName} ${row.customerInformation.lastName}`.trim(),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      valueGetter: (_, row) => row.status.toUpperCase(),
    },
    {
      field: "fineGoldGrams",
      headerName: "Fine Gold (g)",
      flex: 0.8,
      valueGetter: (_, row) => row.totals?.fineGoldGrams?.toFixed(3) ?? "0.000",
    },
    {
      field: "payout",
      headerName: "Payout",
      flex: 0.9,
      valueGetter: (_, row) => formatCurrency(row.totals?.payout ?? 0),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueGetter: (_, row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "—",
    },
  ];

  return (
    <Box>
      {/* Filter Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        {/* Search on Left */}
        <TextField
          label="Search"
          placeholder="Search ticket or customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
        />

        {/* Filters + Action on Right */}
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            {goldBuyStatuses.map((state) => (
              <MenuItem key={state} value={state}>
                {state.toUpperCase()}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            onClick={onNew}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              height: 38,
              px: 2.5,
              borderRadius: 1,
            }}
          >
            New Gold Buy
          </Button>
        </Stack>
      </Stack>

      {/* Data Table */}
      <Box
         sx={{ height: 600, width: "100%" }}
      >
        <DataGrid
          rows={filtered.map((ticket) => ({
            id: ticket.id ?? ticket.ticketNumber,
            ...ticket,
          }))}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          density="comfortable"
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
         
          onRowClick={(params) => {
            const ticket = records.find(
              (candidate) =>
                candidate.id === params.id ||
                candidate.ticketNumber === params.row.ticketNumber
            );
            if (ticket) onRowClick(ticket);
          }}
        />
      </Box>
    </Box>
  );
}
