import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Snackbar,
  useTheme,
} from "@/components/common";
import { CircularProgress } from "@mui/material";
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

/**
 * PoliciesPage
 * Manages store policy CRUD operations with consistent layout and dark-mode styling.
 */
export default function PoliciesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const policies = useSelector(selectAllPolicies);
  const loading = useSelector(selectPoliciesLoading);

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

  // Fetch policies once on mount
  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  // Handlers
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

  // Themed paper backgrounds
  const paperBg =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.background.default;
  const infoBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.background.paper;

  // Loading fallback
  if (loading && !policies.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom component="div">
        Store Policies
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage the store policies that appear on invoices, receipts, and
        customer documents. You can create, edit, or remove them as needed.
      </Typography>

      <Grid spacing={3}>
        {/* Left column: Main content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: paperBg,
              width: "100%",
            }}
          >
           

            <PoliciesHeader onCreate={handleCreate} />

            <PolicyTable
              policies={policies}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Paper>
        </Grid>

        {/* Right column: Info panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: infoBg,
              height: "30%",
            }}
          >
            <Typography
              variant="subtitle1"
              component="div"
              fontWeight={600}
              gutterBottom
            >
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

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        severity={snack.severity}
        message={snack.message}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
