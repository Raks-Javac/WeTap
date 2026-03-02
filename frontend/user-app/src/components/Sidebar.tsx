import { Clock, CreditCard, Home, Receipt, Send, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/app/home", match: "/app/home", label: "Dashboard", icon: Home },
    {
      path: "/app/tap",
      match: "/app/tap",
      label: "Tap to Pay",
      icon: CreditCard,
    },
    {
      path: "/app/cards",
      match: "/app/cards",
      label: "My Cards",
      icon: CreditCard,
    },
    {
      path: "/app/bills/categories",
      match: "/app/bills",
      label: "Pay Bills",
      icon: Receipt,
    },
    {
      path: "/app/transfers/new",
      match: "/app/transfers",
      label: "Transfers",
      icon: Send,
    },
    {
      path: "/app/history",
      match: "/app/history",
      label: "History",
      icon: Clock,
    },
    {
      path: "/app/settings",
      match: "/app/settings",
      label: "Settings",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-text-primary)] to-[var(--color-text-secondary)]">
          WeTap.
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        <div className="space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname.startsWith(item.match) ||
              (item.path === "/app/home" && location.pathname === "/app");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-[15px] display-font transition-all duration-300 group ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] active:scale-95"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <button className="flex items-center gap-3.5 px-4 py-3 w-full text-left rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm group active:scale-95">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
