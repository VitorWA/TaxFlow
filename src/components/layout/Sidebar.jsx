import { NavLink } from "react-router-dom";
import {
  Bell,
  FileText,
  History,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import Brand from "./Brand";
import { sidebarItems } from "../../data/mockData";

const icons = {
  Dashboard: LayoutDashboard,
  "Nova Consulta": Search,
  Histórico: History,
  Favoritos: Star,
  Alertas: Bell,
  Relatórios: FileText,
  Configurações: Settings,
};

export default function Sidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={`${
        mobile
          ? "w-full rounded-[28px]"
          : "fixed left-0 top-0 hidden h-screen w-[280px] xl:flex"
      } flex-col bg-[#071427] p-6 text-white shadow-[0_25px_60px_rgba(2,6,23,0.35)]`}
    >
      <Brand />
      <nav className="mt-10 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = icons[item.label];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400/20 text-sm font-bold text-orange-300">
            JS
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">João Silva</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
          <Sparkles size={16} className="text-orange-300" />
        </div>
      </div>
    </aside>
  );
}
