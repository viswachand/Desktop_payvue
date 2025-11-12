import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

interface DeleteSaleDialogProps {
  open: boolean;
  invoiceNumber?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteSaleDialog({
  open,
  invoiceNumber,
  onCancel,
  onConfirm,
  loading = false,
}: DeleteSaleDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Sale</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete sale
          {invoiceNumber ? ` ${invoiceNumber}` : ""}? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
