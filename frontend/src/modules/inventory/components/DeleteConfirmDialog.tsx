import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  deleteItem,
  fetchItems,
  selectItemsLoading,
  selectItemsSuccess,
  resetItemsState,
} from "@/features/items/itemSlice";
import type { Item } from "@payvue/shared/types/item";

interface Props {
  open: boolean;
  item: Item | null;
  onClose: () => void;
}

export default function DeleteConfirmDialog({ open, item, onClose }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectItemsLoading);
  const success = useSelector(selectItemsSuccess);
  const [submitted, setSubmitted] = useState(false);

  const handleDelete = async () => {
    if (!item || !item.id) return;
    setSubmitted(true);
    await dispatch(deleteItem(item.id));
  };

  useEffect(() => {
    if (submitted && success) {
      dispatch(fetchItems());
      dispatch(resetItemsState());
      setSubmitted(false);
      onClose();
    }
  }, [success, submitted, dispatch, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: theme.palette.error.main }}>
        Confirm Deletion
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Are you sure you want to permanently delete{" "}
          <strong>{item?.itemName}</strong> (SKU: {item?.itemSKU}) from your
          inventory?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pr: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isLoading}
          sx={{
            "&:hover": { backgroundColor: theme.palette.error.dark },
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
