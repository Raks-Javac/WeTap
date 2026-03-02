import { useEffect } from "react";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { useAdminStore } from "./core/store";

import AdminLayout from "./components/AdminLayout";
import AuthGuard from "./components/AuthGuard";
import LoginPage from "./features/auth/pages/LoginPage";
import CardWizard from "./features/cards/pages/CardWizard";
import AdminDashboard from "./features/dashboard/pages/AdminDashboard";
import TransactionsPage from "./features/transactions/pages/TransactionsPage";

function App() {
  const { theme, environment } = useAdminStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-env", environment);
  }, [theme, environment]);

  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/cards" element={<CardWizard />} />

            {/* Placeholders for the remaining simple views */}
            <Route
              path="/users"
              element={
                <div className="p-8 font-bold text-xl">
                  User Directory (Pending Data Integration)
                </div>
              }
            />
            <Route
              path="/billers"
              element={
                <div className="p-8 font-bold text-xl">
                  Biller Integrations Panel
                </div>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <div className="p-8 font-bold text-xl">System Audit Logs</div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="p-8 font-bold text-xl">
                  Platform Configuration Flags
                </div>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
