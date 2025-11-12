import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  useTheme,
} from "@/components/common";
import { Drawer, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  createPolicy,
  updatePolicy,
  selectPoliciesLoading,
  selectPoliciesError,
  clearPolicyError,
} from "@/features/policy/policySlice";
import type { AppDispatch } from "@/app/store";
import type { Policy } from "@payvue/shared/types/policy";

interface Props {
  open: boolean;
  onClose: () => void;
  editingPolicy: Policy | null;
  onSuccess: (msg: string) => void;
}

export default function PolicyFormDrawer({
  open,
  onClose,
  editingPolicy,
  onSuccess,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectPoliciesLoading);
  const error = useSelector(selectPoliciesError);
  const theme = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = Boolean(editingPolicy);

  useEffect(() => {
    if (editingPolicy) {
      setTitle(editingPolicy.title);
      setDescription(editingPolicy.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingPolicy]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      if (isEdit && editingPolicy?.id) {
        await dispatch(
          updatePolicy({
            id: editingPolicy.id,
            updates: { title, description },
          })
        ).unwrap();
        onSuccess("Policy updated successfully");
      } else {
        await dispatch(createPolicy({ title, description })).unwrap();
        onSuccess("Policy created successfully");
      }
      onClose();
    } catch {
      /* handled by slice */
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 420,
          p: 3,
          top: theme.mixins.toolbar.minHeight,
          height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%" gap={3}>
        <Stack spacing={3} flexGrow={1}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? "Edit Policy" : "New Policy"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEdit
                ? "Update the selected policy"
                : "Create a new store policy"}
            </Typography>
          </Box>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearPolicyError())}>
            {error}
          </Alert>
        )}

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              multiline
              minRows={12}
              maxRows={Infinity}
              sx={{
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                  alignItems: "flex-start",
                },
                "& .MuiInputBase-inputMultiline": {
                  lineHeight: 1.5,
                  height: "100%",
                  overflow: "auto",
                  padding: theme.spacing(0.1),
                },
              }}
            />
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2} mt="auto">
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
            startIcon={isLoading ? <CircularProgress size={18} /> : undefined}
            fullWidth
          >
            {isEdit ? "Save Changes" : "Create"}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
