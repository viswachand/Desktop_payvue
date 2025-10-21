import React, { useMemo, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import type { User } from "@payvue/shared/types/user";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

interface Props {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

/**
 * Optimized DataGrid table for displaying and managing users.
 * Features:
 * - Memoized columns & data
 * - Stable callbacks to prevent re-renders
 * - MUI-styled chips for Status and Role
 */
export default function UserTable({ users, onView, onEdit, onDelete }: Props) {
  const theme = useTheme();

  // ✅ Memoize derived data (avoids re-mapping on every render)
  const safeUsers = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        status: u.status ?? "inactive",
        isAdmin: u.isAdmin ?? false,
      })),
    [users]
  );

  // ✅ Stable handlers to prevent unnecessary re-renders
  const handleView = useCallback((user: User) => onView(user), [onView]);
  const handleEdit = useCallback((user: User) => onEdit(user), [onEdit]);
  const handleDelete = useCallback((id: string) => onDelete(id), [onDelete]);

  // ✅ Memoize column definitions for performance
  const columns: GridColDef<User>[] = useMemo(
    () => [
      {
        field: "firstName",
        headerName: "Name",
        flex: 1.2,
        renderCell: (params: GridRenderCellParams<User>) => (
          <Typography fontWeight={600}>
            {params.row.firstName} {params.row.lastName}
          </Typography>
        ),
      },
      {
        field: "username",
        headerName: "Username",
        flex: 1,
      },
      {
        field: "contactNumber",
        headerName: "Contact",
        flex: 1,
        valueGetter: (_, row) => formatPhoneNumber(row.contactNumber ?? "—"),
      },
      {
        field: "employeeStartDate",
        headerName: "Start Date",
        flex: 1,
        valueGetter: (_, row) =>
          row.employeeStartDate
            ? new Date(row.employeeStartDate).toLocaleDateString()
            : "—",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<User>) => (
          <Chip
            label={params.row.status?.toUpperCase() ?? "INACTIVE"}
            color={
              params.row.status === "active"
                ? "success"
                : params.row.status === "inactive"
                ? "default"
                : "warning"
            }
            size="small"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "isAdmin",
        headerName: "Role",
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<User>) => (
          <Chip
            label={params.row.isAdmin ? "Admin" : "User"}
            color={params.row.isAdmin ? "secondary" : "primary"}
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
        renderCell: (params: GridRenderCellParams<User>) => {
          const row = params.row;
          return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
             
              <Tooltip title="Edit User">
                <IconButton
                  color="secondary"
                  onClick={() => handleEdit(row)}
                  size="small"
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete User">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(row.id ?? "")}
                  size="small"
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [handleView, handleEdit, handleDelete]
  );

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid<User>
        rows={safeUsers}
        columns={columns}
        getRowId={(r) => r.id ?? `${r.username}-${Math.random()}`}
        disableColumnMenu
        disableRowSelectionOnClick
        rowHeight={70}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        onCellClick={(params, event) => event.stopPropagation()}
      />
    </Box>
  );
}
