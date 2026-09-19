import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const token = localStorage.getItem("staymatch_token");
  const storedUser = localStorage.getItem("staymatch_user");

  // 1. Not authenticated -> Redirect to login
  if (!token || !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user = null;
  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("staymatch_token");
    localStorage.removeItem("staymatch_user");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role authorization check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If unauthorized, redirect to their proper dashboard based on actual role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "owner") {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
}
