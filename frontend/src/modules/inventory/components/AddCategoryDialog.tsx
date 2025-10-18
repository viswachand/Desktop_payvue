import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Grid, TextField, Button, Typography, Divider } from "@/components/common";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  selectCategoryLoading,
  resetCategoryState,
} from "@/features/category/category";
import type { AppDispatch } from "@/app/store";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddCategoryDialog({ open, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectCategoryLoading);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
    }),
    onSubmit: async (values) => {
      await dispatch(createCategory(values));
      onClose();
      dispatch(resetCategoryState());
    },
  });

  useEffect(() => {
    if (!open) formik.resetForm();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={500}>
          Add Category
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="name"
                label="Category Name"
                fullWidth
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={formik.submitForm}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
