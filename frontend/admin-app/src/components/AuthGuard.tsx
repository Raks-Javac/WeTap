import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../core/store";

const AuthGuard = () => {
  const { isAuthenticated } = useAdminStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
