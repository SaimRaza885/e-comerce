import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false ,user}) => {

  // if user not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // if adminOnly and user is not admin, redirect to home
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
