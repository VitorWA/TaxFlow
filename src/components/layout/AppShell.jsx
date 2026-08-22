import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.localStorage.getItem("taxflow-sidebar-collapsed") === "true",
  );

  useEffect(() => {
    window.localStorage.setItem("taxflow-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,#fff7f1_0%,#f8fafc_28%,#fffdf9_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        />
        {mobileOpen && (
          <div className="xl:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
        <main
          className={`min-w-0 flex-1 space-y-6 p-4 transition-[margin] duration-300 xl:p-6 ${
            sidebarCollapsed ? "xl:ml-[88px]" : "xl:ml-[280px]"
          }`}
        >
          <Header
            mobileMenuOpen={mobileOpen}
            onMenuClick={() => setMobileOpen((value) => !value)}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
