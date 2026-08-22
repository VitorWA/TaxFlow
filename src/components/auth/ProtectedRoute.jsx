import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">Carregando sua conta...</div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
