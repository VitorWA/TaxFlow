import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AuthLayout from "./components/layout/AuthLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoveryPage from "./pages/RecoveryPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import ResultPage from "./pages/ResultPage";
import DetailPage from "./pages/DetailPage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-acesso" element={<RecoveryPage />} />
      </Route>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage activeSection="dashboard" />} />
        <Route path="/nova-consulta" element={<DashboardPage activeSection="nova-consulta" />} />
        <Route path="/historico" element={<HistoryPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/alertas" element={<AlertsPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="/resultado" element={<ResultPage />} />
      <Route path="/detalhamento" element={<DetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
