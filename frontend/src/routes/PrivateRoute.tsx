import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  initializeAuth,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import type { AppDispatch } from "@/app/store";
import { useEffect } from "react";

const PrivateRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
