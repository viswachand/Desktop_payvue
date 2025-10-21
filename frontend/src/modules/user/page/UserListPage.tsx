import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Snackbar,
} from "@/components/common"; 
import { Grid } from "@mui/material";
import { CircularProgress } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUserActions } from "../hooks/useUserActions";
import {
  selectUsers,
  selectUserLoading,
  selectUserError,
} from "@/features/user/userSlice";
import type { User } from "@payvue/shared/types/user";
import UserTable from "../component/UserTable";
import DeleteUserDialog from "../component/DeleteUserDialog";

export default function UserListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { fetchUsers, deleteUser } = useUserActions();

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ Fetch once on mount (no infinite loops)
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Stable handlers
  const handleAddUser = useCallback(() => {
    navigate("/users/add");
  }, [navigate]);

  const handleView = useCallback(
    (user: User) => navigate(`/users/view/${user.id}`),
    [navigate]
  );

  const handleEdit = useCallback(
    (user: User) => navigate(`/users/edit/${user.id}`),
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const found = users.find((u) => u.id === id);
      setSelectedUser(found ?? null);
      setDeleteDialogOpen(true);
    },
    [users]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedUser?.id) {
      await deleteUser(selectedUser.id);
      setSnackbar({
        open: true,
        message: `${selectedUser.firstName} deleted successfully`,
        severity: "success",
      });
    }
    setDeleteDialogOpen(false);
  }, [deleteUser, selectedUser]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // ✅ Memoized table component
  const userTable = useMemo(
    () =>
      !loading ? (
        <UserTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Box
          sx={{
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ),
    [loading, users, handleView, handleEdit, handleDelete]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* ---------------- Header Section ---------------- */}
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid size={6}>
          <Typography variant="h5" fontWeight={700}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all employees, admins, and user accounts in one place
          </Typography>
        </Grid>

        <Grid size="auto">
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddUser}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add User
          </Button>
        </Grid>
      </Grid>

      {/* ---------------- Table Section ---------------- */}
      <Box mt={3}>{userTable}</Box>

      {/* ---------------- Delete Confirmation Dialog ---------------- */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        username={`${selectedUser?.firstName ?? ""} ${selectedUser?.lastName ?? ""}`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* ---------------- Snackbar ---------------- */}
      <Snackbar
        open={snackbar.open || Boolean(error)}
        severity={error ? "error" : snackbar.severity}
        message={error || snackbar.message}
        onClose={handleCloseSnackbar}
        autoHideDuration={3500}
      />
    </Box>
  );
}
