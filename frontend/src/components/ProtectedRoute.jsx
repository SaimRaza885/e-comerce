import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If children is passed, render it; otherwise render nested <Outlet />
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
