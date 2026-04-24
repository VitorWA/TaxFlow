import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
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
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
    </Routes>
  );
}

export default App;
