import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* RUTA PÚBLICA */}
      <Route path="/login" element={<Login />} />

      {/* RUTAS PROTEGIDAS */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
    </Routes>
  );
}
