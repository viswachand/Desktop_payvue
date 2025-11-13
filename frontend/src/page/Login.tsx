import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { AppDispatch } from "@/app/store";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from "@/features/auth/authSlice";

import AuthLayout from "@/components/layout/AuthLayout";
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@/components/common";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [openSnack, setOpenSnack] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setFormError(null);
        const result = await dispatch(loginUser(values)).unwrap();
        if (result?.token) {
          navigate("/dashboard");
        }
      } catch (err: unknown) {
        const friendlyMessage =
          typeof err === "string"
            ? err
            : err instanceof Error
            ? err.message
            : "Unable to login. Please check your credentials.";
        setFormError(friendlyMessage);
        setOpenSnack(true);
      }
    },
  });

  const handleClose = () => {
    setOpenSnack(false);
    dispatch(clearAuthError());
    setFormError(null);
  };

  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={1.5}>
        Welcome Back
      </Typography>

      <Typography
        variant="body2"
        textAlign="center"
        mb={3}
        color="text.secondary"
      >
        Login to access your A-1 Jewelers POS dashboard
      </Typography>

      <Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            fullWidth
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {formError && (
            <Typography
              variant="body2"
              color="error"
              textAlign="center"
              mt={2}
            >
              {formError}
            </Typography>
          )}
        </form>
      </Box>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={3}
        color="text.secondary"
      >
        © {new Date().getFullYear()} A-1 Jewelers POS
      </Typography>

      <Snackbar
        open={openSnack && (!!formError || !!error)}
        message={formError || error || ""}
        severity="error"
        onClose={handleClose}
      />
    </AuthLayout>
  );
};

export default Login;
