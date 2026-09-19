import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import OwnerDashboard from "./pages/Dashboard/OwnerDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import authService from "./services/authService";

function StudentDashboardRoute() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };
  return <StudentDashboard user={user} onLogout={handleLogout} />;
}

function OwnerDashboardRoute() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };
  return <OwnerDashboard user={user} onLogout={handleLogout} />;
}

function AdminDashboardRoute() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };
  return <AdminDashboard user={user} onLogout={handleLogout} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-specific protected dashboards */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardRoute />
            </ProtectedRoute>
          }
        />

        {/* Generic dashboard route: auto-redirects based on logged-in role */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
