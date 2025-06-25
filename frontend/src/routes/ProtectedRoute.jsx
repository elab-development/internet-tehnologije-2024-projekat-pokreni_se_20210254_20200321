import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = () => {
  return getCurrentUser() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;