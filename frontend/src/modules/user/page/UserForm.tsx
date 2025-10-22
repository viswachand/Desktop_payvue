import React, { useEffect, useMemo, useRef } from "react";
import { Box, CircularProgress, MenuItem } from "@mui/material";
import { Grid, TextField, Button, Card, useTheme } from "@/components/common";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  fetchUsers,
  addUser,
  updateUser,
  selectUsers,
  selectUserLoading,
} from "@/features/user/userSlice";
import type { User } from "@payvue/shared/types/user";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function UserFormPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id?: string }>();

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);

  /* ------------------------------------------------------------------ */
  /* ------------------------ Prevent infinite fetch ------------------ */
  /* ------------------------------------------------------------------ */
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  /* ------------------------------------------------------------------ */
  /* ---------------------- Compute existing user --------------------- */
  /* ------------------------------------------------------------------ */
  const existingUser = useMemo(
    () => users.find((u) => u.id === id),
    [users, id]
  );
  const isEditMode = Boolean(existingUser);

  /* ------------------------------------------------------------------ */
  /* ----------------------- Stable initial values -------------------- */
  /* ------------------------------------------------------------------ */
  const initialValues = useMemo(
    () => ({
      firstName: existingUser?.firstName ?? "",
      lastName: existingUser?.lastName ?? "",
      username: existingUser?.username ?? "",
      password: "",
      confirmPassword: "",
      contactNumber: existingUser?.contactNumber ?? "",
      employeeStartDate: existingUser?.employeeStartDate
        ? new Date(existingUser.employeeStartDate)
        : new Date(),
      status: existingUser?.status ?? "active",
      isAdmin: existingUser?.isAdmin ?? false,
    }),
    [existingUser]
  );

  /* ------------------------------------------------------------------ */
  /* -------------------------- Formik setup -------------------------- */
  /* ------------------------------------------------------------------ */
  const formik = useFormik<Partial<User> & { confirmPassword?: string }>({
    initialValues,
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

      if (isEditMode && id) {
        await dispatch(updateUser({ id, data: payload }));
      } else {
        await dispatch(addUser(payload));
      }

      navigate("/users");
    },
  });

  /* ------------------------------------------------------------------ */
  /* ---------------------------- Loading ----------------------------- */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ------------------------------------------------------------------ */
  /* ------------------------------ UI -------------------------------- */
  /* ------------------------------------------------------------------ */
  return (
    <Box sx={{ p: 3 }}>
      <Card
        title={isEditMode ? "Edit User" : "Add New User"}
        showHeaderDivider
        contentSx={{ p: 2 }}
      >
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid spacing={3}>
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <Grid spacing={2}>
                  {/* First Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      fullWidth
                      size="small"
                      autoComplete="given-name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      size="small"
                      autoComplete="family-name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                    />
                  </Grid>

                  {/* Username */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      id="username"
                      name="username"
                      label="Username"
                      fullWidth
                      size="small"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.username &&
                        Boolean(formik.errors.username)
                      }
                      helperText={
                        formik.touched.username && formik.errors.username
                      }
                    />
                  </Grid>

                  {/* Password Fields */}
                  {!isEditMode && (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          id="password"
                          name="password"
                          label="Password"
                          type="password"
                          fullWidth
                          size="small"
                          autoComplete="new-password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                          }
                          helperText={
                            formik.touched.password && formik.errors.password
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          fullWidth
                          size="small"
                          autoComplete="new-password"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      id="contactNumber"
                      name="contactNumber"
                      label="Contact Number"
                      fullWidth
                      size="small"
                      autoComplete="tel"
                      value={formik.values.contactNumber}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        formik.setFieldValue("contactNumber", formatted);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.contactNumber &&
                        Boolean(formik.errors.contactNumber)
                      }
                      helperText={
                        formik.touched.contactNumber &&
                        formik.errors.contactNumber
                      }
                    />
                  </Grid>

                  {/* Start Date */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      id="employeeStartDate"
                      name="employeeStartDate"
                      label="Start Date"
                      type="date"
                      fullWidth
                      size="small"
                      autoComplete="off"
                      value={
                        formik.values.employeeStartDate
                          ? new Date(formik.values.employeeStartDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
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
                </Grid>
              </Card>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <Grid spacing={2}>
                  {/* Status */}
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                      id="status"
                      name="status"
                      label="Status"
                      select
                      fullWidth
                      size="small"
                      autoComplete="off"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Role */}
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                      id="isAdmin"
                      name="isAdmin"
                      label="Role"
                      select
                      fullWidth
                      size="small"
                      autoComplete="off"
                      value={formik.values.isAdmin ? "true" : "false"}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "isAdmin",
                          e.target.value === "true"
                        )
                      }
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="false">User</MenuItem>
                      <MenuItem value="true">Admin</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mt={4}
            gap={2}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
