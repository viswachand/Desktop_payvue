import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  initializeAuth,
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/features/auth/authSlice";
import type { AppDispatch } from "@/app/store";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(initializeAuth());
      setInitialized(true);
    };
    initAuth();
  }, [dispatch]);

  if (!initialized || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
