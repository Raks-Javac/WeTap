import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    Building2,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    ShieldAlert,
    Users,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAdminStore } from "../core/store";

const AdminLayout = () => {
  const { theme, environment, setTheme, logout } = useAdminStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/dashboard", label: "Mission Control", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions Feed", icon: Activity },
    { path: "/cards", label: "Card Management", icon: CreditCard },
    { path: "/users", label: "User Directory", icon: Users },
    { path: "/billers", label: "Biller Integrations", icon: Building2 },
    { path: "/audit-logs", label: "System Audit", icon: ShieldAlert },
    { path: "/settings", label: "Platform Config", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-gradient display-font">
            WeTap Admin.
          </h1>
          <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] mt-1 uppercase tracking-[0.2em]">
            Shield Operative
          </p>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname === item.path.replace("/admin", "");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive ? "text-white" : "text-[var(--color-text-tertiary)]"
                }
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)] text-sm space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent text-white flex justify-center items-center font-black shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-none truncate overflow-hidden">
              Admin User
            </p>
            <p className="text-[10px] text-brand-primary font-black mt-1 uppercase tracking-wider">
              SU_OPERATIVE
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full text-left text-red-500 hover:bg-red-500/5 font-bold px-3 py-2.5 rounded-xl transition-colors"
        >
          <LogOut size={18} /> Exit System
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] selection:bg-brand-primary/20">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Environment Strip */}
        <div
          className={`w-full py-1.5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm z-30 ${
            environment === "dev"
              ? "bg-brand-accent/90"
              : environment === "uat"
                ? "bg-brand-primary/90"
                : "bg-emerald-600/90"
          }`}
        >
          ENVIRONMENT::{environment} node_active
        </div>

        {/* Top Header */}
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-brand-primary transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Link Established</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block h-8 w-[1px] bg-[var(--color-border)] mx-2" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] transition-all text-lg shadow-sm"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </motion.button>
          </div>
        </header>

        {/* Page Yield */}
        <main className="flex-1 p-4 lg:p-10 relative z-10 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
