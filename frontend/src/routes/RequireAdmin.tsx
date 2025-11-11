import { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAdmin } from "@/features/auth/authSlice";

export default function RequireAdmin({ children }: PropsWithChildren) {
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
