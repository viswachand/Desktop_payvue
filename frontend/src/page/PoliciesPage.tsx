import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, useTheme, Snackbar } from "@/components/common";
import { Box } from "@/components/common";
import Grid from "@mui/material/Grid";
import {
  fetchPolicies,
  selectAllPolicies,
  selectPoliciesLoading,
  deletePolicy,
} from "@/features/policy/policySlice";
import type { AppDispatch } from "@/app/store";
import type { Policy } from "@payvue/shared/types/policy";
import PoliciesHeader from "@/modules/policies/PoliciesHeader";
import PolicyTable from "@/modules/policies/PolicyTable";
import PolicyFormDrawer from "@/modules/policies/PolicyFormDrawer";
import ConfirmDeleteDialog from "@/modules/policies/ConfirmDeleteDialog";

export default function PoliciesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const policies = useSelector(selectAllPolicies);
  const isLoading = useSelector(selectPoliciesLoading);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingPolicy(null);
    setDrawerOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setDrawerOpen(true);
  };

  const handleDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deletePolicy(deleteId)).unwrap();
      setSnack({
        open: true,
        message: "Policy deleted successfully",
        severity: "success",
      });
    } catch {
      setSnack({
        open: true,
        message: "Failed to delete policy",
        severity: "error",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Store Policies
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage the store policies that appear on invoices, receipts, and
        customer documents. You can create, edit, or remove them as needed.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ sm: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <PoliciesHeader onCreate={handleCreate} />
            <PolicyTable
              policies={policies}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Paper>
        </Grid>

        <Grid size={{ sm: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[50]
                  : theme.palette.background.default,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Why this matters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Store policies help maintain transparency and build trust with
              customers. These appear on every invoice and receipt, ensuring
              customers understand return conditions, warranties, and other
              terms before purchase.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Drawer for create/edit */}
      <PolicyFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingPolicy={editingPolicy}
        onSuccess={(msg) => {
          setSnack({ open: true, message: msg, severity: "success" });
          setDrawerOpen(false);
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDeleteDialog
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <Snackbar
        open={snack.open}
        message={snack.message}
        // severity={snack.severity}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
