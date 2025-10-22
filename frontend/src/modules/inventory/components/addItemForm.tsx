import { useEffect, useState, useMemo, useRef } from "react";
import { Box, CircularProgress, MenuItem } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  useTheme,
} from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "@/app/store";
import {
  createItem,
  updateItem,
  fetchItems,
  selectItemsLoading,
  selectItemsSuccess,
  resetItemsState,
  selectAllItems,
} from "@/features/items/itemSlice";
import {
  fetchCategories,
  selectAllCategories,
  selectCategoryLoading,
} from "@/features/category/category";
import type { Item } from "@payvue/shared/types/item";
import AddCategoryDialog from "./AddCategoryDialog";

export default function ItemFormPage() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const isLoading = useSelector(selectItemsLoading);
  const success = useSelector(selectItemsSuccess);
  const items = useSelector(selectAllItems);
  const categories = useSelector(selectAllCategories);
  const loadingCategories = useSelector(selectCategoryLoading);

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchCategories());
      dispatch(fetchItems());
    }
  }, [dispatch]);

  const editItem = useMemo(
    () => (id ? items.find((i) => i.id === id) : null),
    [items, id]
  );
  const isEditMode = Boolean(editItem);

  const formik = useFormik<Item>({
    enableReinitialize: true,
    initialValues: {
      itemSKU: editItem?.itemSKU ?? "",
      itemName: editItem?.itemName ?? "",
      itemDescription: editItem?.itemDescription ?? "",
      itemCategory:
        typeof editItem?.itemCategory === "object"
          ? (editItem.itemCategory as any)?._id ?? ""
          : editItem?.itemCategory ?? "",
      costPrice: editItem?.costPrice ?? 0,
      unitPrice: editItem?.unitPrice ?? 0,
      quantity: editItem?.quantity ?? 0,
      itemType: editItem?.itemType ?? "inventory",
      style: editItem?.style ?? "",
      storeCode: editItem?.storeCode ?? "",
      size: editItem?.size ?? "",
      vendor: editItem?.vendor ?? "",
      eglId: editItem?.eglId ?? "",
      location: editItem?.location ?? "",
      customText1: editItem?.customText1 ?? "",
      customText2: editItem?.customText2 ?? "",
      customText3: editItem?.customText3 ?? "",
      customFloat: editItem?.customFloat ?? undefined,
      metal: editItem?.metal ?? "",
      department: editItem?.department ?? "",
      itemCode: editItem?.itemCode ?? "",
      vendorStyle: editItem?.vendorStyle ?? "",
      agsId: editItem?.agsId ?? "",
      giaId: editItem?.giaId ?? "",
      barcode: editItem?.barcode ?? "",
      imageUrl: editItem?.imageUrl ?? "",
    },
    validationSchema: Yup.object({
      itemSKU: Yup.string().required("Item SKU is required"),
      itemName: Yup.string().required("Item name is required"),
      itemDescription: Yup.string().required("Item description is required"),
      itemCategory: Yup.string().required("Item category is required"),
      costPrice: Yup.number()
        .typeError("Cost price must be a number")
        .positive("Cost price must be greater than 0")
        .required("Cost price is required"),
      unitPrice: Yup.number()
        .typeError("Unit price must be a number")
        .positive("Unit price must be greater than 0")
        .required("Unit price is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .min(0, "Quantity cannot be negative")
        .required("Quantity is required"),
    }),
    onSubmit: async (values) => {
      const payload = { ...values };
      if (isEditMode && id) await dispatch(updateItem({ id, updates: payload }));
      else await dispatch(createItem(payload));
    },
  });

  useEffect(() => {
    if (success) {
      navigate("/inventory");
      dispatch(fetchItems());
      dispatch(resetItemsState());
    }
  }, [success, dispatch, navigate]);

  const paperBg =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.background.default;

  return (
    <Box sx={{ p: 3 }}>
      <Card
        title={isEditMode ? "Edit Item" : "Add New Item"}
        showHeaderDivider
        contentSx={{
          borderRadius: theme.shape.borderRadius,
          backgroundColor: paperBg,
        }}
      >
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid>
            <Grid size={{ xs: 12, md: 6 }} >
              <Card sx={{ backgroundColor: paperBg, p:0, borderRadius:0 }}>
                <Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="itemSKU"
                      label="Item SKU"
                      fullWidth
                      size="small"
                      value={formik.values.itemSKU}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.itemSKU && Boolean(formik.errors.itemSKU)}
                      helperText={formik.touched.itemSKU && formik.errors.itemSKU}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="itemName"
                      label="Item Name"
                      fullWidth
                      size="small"
                      value={formik.values.itemName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                      helperText={formik.touched.itemName && formik.errors.itemName}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      name="itemCategory"
                      label="Select Category"
                      fullWidth
                      size="small"
                      value={formik.values.itemCategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.itemCategory &&
                        Boolean(formik.errors.itemCategory)
                      }
                      helperText={
                        formik.touched.itemCategory && formik.errors.itemCategory
                      }
                    >
                      {loadingCategories ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        mt: 0.5,
                        width: "fit-content",
                      }}
                      onClick={() => setAddCategoryOpen(true)}
                    >
                      + Add New Category
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="itemDescription"
                      label="Description"
                      fullWidth
                      size="small"
                      value={formik.values.itemDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.itemDescription &&
                        Boolean(formik.errors.itemDescription)
                      }
                      helperText={
                        formik.touched.itemDescription &&
                        formik.errors.itemDescription
                      }
                    />
                  </Grid>

                  {[
                    { name: "costPrice", label: "Cost Price ($)", type: "number" },
                    { name: "unitPrice", label: "Unit Price ($)", type: "number" },
                    { name: "quantity", label: "Quantity", type: "number" },
                  ].map((field) => (
                    <Grid key={field.name} size={{ xs: 12, md: 4 }}>
                      <TextField
                        name={field.name}
                        label={field.label}
                        fullWidth
                        type={field.type}
                        size="small"
                        value={(formik.values as any)[field.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched[field.name as keyof Item] &&
                          Boolean(formik.errors[field.name as keyof Item])
                        }
                        helperText={
                          formik.touched[field.name as keyof Item] &&
                          formik.errors[field.name as keyof Item]
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ backgroundColor: paperBg, p:0, borderRadius:0 }}>
                <Grid spacing={2}>
                  {[
                    { name: "vendor", label: "Vendor" },
                    { name: "metal", label: "Metal" },
                    { name: "department", label: "Department" },
                    { name: "location", label: "Location" },
                    { name: "storeCode", label: "Store Code" },
                    { name: "size", label: "Size" },
                    { name: "itemCode", label: "Item Code" },
                    { name: "vendorStyle", label: "Vendor Style" },
                    { name: "eglId", label: "EGL ID" },
                    { name: "agsId", label: "AGS ID" },
                    { name: "giaId", label: "GIA ID" },
                    { name: "barcode", label: "Barcode" },
                    { name: "customText1", label: "Custom Text 1" },
                    { name: "customText2", label: "Custom Text 2" },
                    { name: "customText3", label: "Custom Text 3" },
                    { name: "customFloat", label: "Custom Float", type: "number" },
                    { name: "imageUrl", label: "Image URL" },
                  ].map((field) => (
                    <Grid key={field.name} size={{ xs: 12, md: 4 }}>
                      <TextField
                        name={field.name}
                        label={field.label}
                        fullWidth
                        type={field.type || "text"}
                        size="small"
                        value={(formik.values as any)[field.name] || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/inventory")}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          </Box>
        </form>
      </Card>

      <AddCategoryDialog
        open={addCategoryOpen}
        onClose={() => {
          setAddCategoryOpen(false);
          dispatch(fetchCategories());
        }}
      />
    </Box>
  );
}
