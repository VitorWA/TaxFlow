import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,#fff7f1_0%,#f8fafc_28%,#fffdf9_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 space-y-6 p-4 xl:ml-[280px] xl:p-6">
          <Header onMenuClick={() => setMobileOpen((value) => !value)} />
          {mobileOpen && (
            <div className="xl:hidden">
              <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
