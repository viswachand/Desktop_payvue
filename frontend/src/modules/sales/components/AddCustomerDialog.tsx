import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Typography,
  useTheme,
  Grid,
  TextField,
  Divider,
} from "@/components/common";
import { Button } from "@/components/common";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Customer } from "@payvue/shared/types/customer";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export default function AddCustomerDialog({
  open,
  onClose,
  onSave,
}: AddCustomerDialogProps) {
  const theme = useTheme();

  const formik = useFormik<Customer>({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      postalCode: "",
      state: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      phone: Yup.string()
        .matches(/^[0-9()\- ]+$/, "Phone must contain only numbers")
        .required("Phone is required"),
    }),
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography variant="h6" fontWeight={500}>
          Add Customer
        </Typography>
      </DialogTitle>
      <Divider sx={{ mt: 2 }} />

      <DialogContent
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2.2}>
            {[
              {
                name: "firstName",
                label: "First Name",
                placeholder: "Enter First Name",
              },
              {
                name: "lastName",
                label: "Last Name",
                placeholder: "Enter Last Name",
              },
              { name: "phone", label: "Phone", placeholder: "Enter Phone" },
              { name: "email", label: "Email", placeholder: "Enter Email" },
              {
                name: "address1",
                label: "Address 1",
                placeholder: "Enter Address 1",
              },
              {
                name: "address2",
                label: "Address 2",
                placeholder: "Enter Address 2",
              },
              { name: "city", label: "City", placeholder: "Enter City" },
              {
                name: "postalCode",
                label: "Postal Code",
                placeholder: "Enter Postal Code",
              },
              { name: "state", label: "State", placeholder: "Enter State" },
            ].map((field) => (
              <Grid
                key={field.name}
                size={{
                  xs:
                    field.name === "address1" || field.name === "address2"
                      ? 12
                      : 6,
                }}
              >
                <TextField
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={(formik.values as any)[field.name]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (field.name === "phone") {
                      const formatted = formatPhoneNumber(e.target.value);
                      formik.setFieldValue("phone", formatted);
                    } else {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name as keyof Customer] &&
                    Boolean(formik.errors[field.name as keyof Customer])
                  }
                  helperText={
                    formik.touched[field.name as keyof Customer] &&
                    formik.errors[field.name as keyof Customer]
                  }
                />
              </Grid>
            ))}
          </Grid>
        </form>
      </DialogContent>

      {/* ----- Footer Actions ----- */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor:
            theme.palette.mode === "light"
              ? theme.palette.grey[50]
              : theme.palette.background.default,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: theme.shape.borderRadius,
            px: 3,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={formik.submitForm}
          sx={{
            borderRadius: theme.shape.borderRadius,
            px: 3,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
