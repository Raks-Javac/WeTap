import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../core/store";

const AuthGuard = () => {
  const { isAuthenticated } = useAdminStore();
  const hasToken = Boolean(localStorage.getItem("wetap_admin_access"));

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
