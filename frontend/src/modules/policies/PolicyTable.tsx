import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import type { Policy } from "@payvue/shared/types/policy";
import { useTheme } from "@/components/common";
interface Props {
  policies: Policy[];
  loading: boolean;
  onEdit: (policy: Policy) => void;
  onDelete: (id: string) => void;
}

export default function PolicyTable({
  policies,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const columns: GridColDef<Policy>[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<Policy>) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => onEdit(params.row)}>
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => onDelete(params.row.id!)}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box height={500}>
      <DataGrid
        rows={policies}
        columns={columns}
        getRowId={(row) => row.id!}
        loading={loading}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
     
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        sx={{
         
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[100],
            height: "3rem",
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
  );
}
