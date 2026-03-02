import { Outlet } from "react-router-dom";
import AIChatPanel from "../features/chat/components/AIChatPanel";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
      <AIChatPanel />
    </div>
  );
};

export default AppLayout;
