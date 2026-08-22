import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  FileText,
  History,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Star,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Brand from "./Brand";
import { sidebarItems } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";

const icons = {
  Dashboard: LayoutDashboard,
  "Nova Consulta": Search,
  Histórico: History,
  Favoritos: Star,
  Alertas: Bell,
  Relatórios: FileText,
  Configurações: Settings,
};

export default function Sidebar({
  mobile = false,
  collapsed = false,
  onNavigate,
  onToggleCollapse,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    onNavigate?.();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`${
        mobile
          ? "fixed inset-y-0 left-0 z-50 flex w-[280px] p-6"
          : `fixed left-0 top-0 hidden h-screen xl:flex ${collapsed ? "w-[88px] p-4" : "w-[280px] p-6"}`
      } flex-col overflow-hidden bg-[#071427] text-white shadow-[0_25px_60px_rgba(2,6,23,0.35)] transition-[width,padding] duration-300`}
    >
      <div className={`flex h-11 items-center ${collapsed && !mobile ? "justify-center" : "justify-between"}`}>
        <Brand compact={collapsed && !mobile} />
        {!mobile && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Recolher menu"
            title="Recolher menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <PanelLeftClose size={20} />
          </button>
        )}
        {mobile && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Fechar menu"
            title="Fechar menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {!mobile && collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expandir menu"
          title="Expandir menu"
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      <nav className={`${collapsed && !mobile ? "mt-5" : "mt-10"} space-y-2`}>
        {sidebarItems.map((item) => {
          const Icon = icons[item.label];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              aria-label={collapsed && !mobile ? item.label : undefined}
              title={collapsed && !mobile ? item.label : undefined}
              className={({ isActive }) =>
                `flex h-11 items-center rounded-2xl text-sm font-medium transition ${
                  collapsed && !mobile ? "justify-center px-0" : "gap-3 px-4"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div
          title={collapsed && !mobile ? `${user?.name} - ${user?.email}` : undefined}
          className={`flex items-center rounded-2xl border border-white/10 ${
            collapsed && !mobile ? "justify-center p-2" : "gap-3 px-3 py-3"
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400/20 text-sm font-bold text-orange-300">
            {initials}
          </div>
          {(!collapsed || mobile) && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <Sparkles size={16} className="text-orange-300" />
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label={collapsed && !mobile ? "Sair" : undefined}
          title={collapsed && !mobile ? "Sair" : undefined}
          className={`flex h-11 w-full items-center rounded-2xl text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white ${
            collapsed && !mobile ? "justify-center px-0" : "gap-3 px-4"
          }`}
        >
          <LogOut size={18} />
          {(!collapsed || mobile) && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
