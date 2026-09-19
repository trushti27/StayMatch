import React from "react";
import { Navigate } from "react-router-dom";

export default function DashboardPage() {
  const token = localStorage.getItem("staymatch_token");
  const storedUser = localStorage.getItem("staymatch_user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "owner") {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  } catch {
    localStorage.removeItem("staymatch_token");
    localStorage.removeItem("staymatch_user");
    return <Navigate to="/login" replace />;
  }
}