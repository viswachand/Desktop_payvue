import React, { useEffect } from "react";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import {

  Box,
  Button,
  Typography,
  TextField,
  useTheme,
} from "@/components/common";
import { Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useUserActions } from "../hooks/useUserActions";
import { selectUsers, selectUserLoading } from "@/features/user/userSlice";
import type { User } from "@payvue/shared/types/user";

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { addUser, updateUser, fetchUsers } = useUserActions();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);

  const existingUser = users.find((u) => u.id === id);

  useEffect(() => {
    if (!users.length) fetchUsers();
  }, [users.length, fetchUsers]);

  const formik = useFormik<Partial<User> & { confirmPassword?: string }>({
    initialValues: {
      firstName: existingUser?.firstName || "",
      lastName: existingUser?.lastName || "",
      username: existingUser?.username || "",
      password: "",
      confirmPassword: "",
      contactNumber: existingUser?.contactNumber || "",
      employeeStartDate: existingUser?.employeeStartDate
        ? new Date(existingUser.employeeStartDate)
        : new Date(),
      status: existingUser?.status || "active",
      isAdmin: existingUser?.isAdmin || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name required"),
      lastName: Yup.string().required("Last name required"),
      username: Yup.string().required("Username required"),
      password: !existingUser
        ? Yup.string().required("Password required")
        : Yup.string(),
      confirmPassword: !existingUser
        ? Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password required")
        : Yup.string(),
      contactNumber: Yup.string().required("Contact number required"),
      employeeStartDate: Yup.date().required("Start date required"),
      status: Yup.string().oneOf(["active", "inactive"]).required(),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...payload } = values;
      if (id) {
        await updateUser(id, payload);
      } else {
        await addUser(payload);
      }
      navigate("/users");
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ✅ Heading Section (same style as List Page) */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid size={6}>
          <Typography variant="h5" fontWeight={700}>
            {id ? "Edit User" : "Add New User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {id
              ? "Update existing user details below"
              : "Fill in the details to create a new user"}
          </Typography>
        </Grid>
      </Grid>

      {/* ✅ Form Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: 3,
          borderRadius: theme.shape.borderRadius,
          mt: 3,
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            {!id && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                  />
                </Grid>
              </>
            )}

            <Grid size={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.contactNumber &&
                  Boolean(formik.errors.contactNumber)
                }
                helperText={
                  formik.touched.contactNumber && formik.errors.contactNumber
                }
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="employeeStartDate"
                value={
                  formik.values.employeeStartDate
                    ? new Date(formik.values.employeeStartDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={
                  formik.touched.employeeStartDate &&
                  Boolean(formik.errors.employeeStartDate)
                }
                helperText={
                  formik.touched.employeeStartDate &&
                  formik.errors.employeeStartDate
                }
              />
            </Grid>

            <Grid size={6}>
              <Select
                fullWidth
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </Grid>

            <Grid size={6}>
              <Select
                fullWidth
                name="isAdmin"
                value={formik.values.isAdmin ? "true" : "false"}
                onChange={(e) =>
                  formik.setFieldValue("isAdmin", e.target.value === "true")
                }
              >
                <MenuItem value="false">User</MenuItem>
                <MenuItem value="true">Admin</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" type="submit">
              {id ? "Update" : "Save"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/users")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
