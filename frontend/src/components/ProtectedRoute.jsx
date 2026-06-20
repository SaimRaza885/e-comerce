import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Loading />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
