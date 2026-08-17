import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Sparkles,
  FolderKanban,
  Briefcase,
  GraduationCap,
  FileText,
  Languages,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import "./AdminLayout.css";

const NAV = [
  { to: "/admin", icon: LayoutDashboard, key: "dashboard", end: true },
  { to: "/admin/profile", icon: User, key: "profile" },
  { to: "/admin/skills", icon: Sparkles, key: "skills" },
  { to: "/admin/projects", icon: FolderKanban, key: "projects" },
  { to: "/admin/experience", icon: Briefcase, key: "experience" },
  { to: "/admin/education", icon: GraduationCap, key: "education" },
  { to: "/admin/resume", icon: FileText, key: "resume" },
  { to: "/admin/translations", icon: Languages, key: "translations" },
  { to: "/admin/settings", icon: Settings, key: "settings" },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <button className="admin-layout__mobile-toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle sidebar">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-mark">MU</span>
          <span>Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : undefined}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{t.admin[item.key as keyof typeof t.admin]}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{user?.name?.[0] ?? "A"}</div>
            <div>
              <p className="admin-sidebar__user-name">{user?.name}</p>
              <p className="admin-sidebar__user-email">{user?.email}</p>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} /> {t.admin.logout}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-layout__scrim" onClick={() => setSidebarOpen(false)} />}

      <main className="admin-content">{children}</main>
    </div>
  );
}
