import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useGlobalStore } from "./core/store";

// Features & Layouts
import AppLayout from "./components/AppLayout";
import AuthPage from "./features/auth/pages/AuthPage";
import BillsPage from "./features/bills/pages/BillsPage";
import CardDetailPage from "./features/cards/pages/CardDetailPage";
import CardsPage from "./features/cards/pages/CardsPage";
import AddMoneyPage from "./features/dashboard/pages/AddMoneyPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import HistoryPage from "./features/history/pages/HistoryPage";
import PayPage from "./features/pay/pages/PayPage";

import SettingsPage from "./features/settings/pages/SettingsPage";
import TransfersPage from "./features/transfers/pages/TransfersPage";
import LandingPage from "./pages/LandingPage";

import OnboardingLayout from "./features/onboarding/components/OnboardingLayout";
import OnboardingAddCardPage from "./features/onboarding/pages/OnboardingAddCardPage";
import OnboardingModePage from "./features/onboarding/pages/OnboardingModePage";
import OnboardingPinPage from "./features/onboarding/pages/OnboardingPinPage";
import OnboardingWelcomePage from "./features/onboarding/pages/OnboardingWelcomePage";

function App() {
  const { theme, environment } = useGlobalStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-env", environment);
  }, [theme, environment]);

  return (
    <Router>
      <div className="w-full min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans antialiased overflow-x-hidden">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/signup" element={<AuthPage />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<OnboardingWelcomePage />} />
            <Route path="welcome" element={<OnboardingWelcomePage />} />
            <Route path="mode" element={<OnboardingModePage />} />
            <Route path="add-card" element={<OnboardingAddCardPage />} />
            <Route path="pin" element={<OnboardingPinPage />} />
          </Route>

          {/* Protected Main App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="home" element={<DashboardPage />} />

            <Route path="tap" element={<PayPage />} />
            <Route path="pay/preview" element={<PayPage />} />
            <Route path="pay/pin" element={<PayPage />} />
            <Route path="pay/status/:ref" element={<PayPage />} />
            <Route path="add-money" element={<AddMoneyPage />} />

            <Route path="cards" element={<CardsPage />} />
            <Route path="cards/:id" element={<CardDetailPage />} />

            <Route path="bills/categories" element={<BillsPage />} />
            <Route path="bills/billers/:categoryId" element={<BillsPage />} />
            <Route path="bills/items/:billerId" element={<BillsPage />} />
            <Route path="bills/pay" element={<BillsPage />} />
            <Route path="bills/status/:ref" element={<BillsPage />} />

            <Route path="transfers/new" element={<TransfersPage />} />
            <Route path="transfers/confirm" element={<TransfersPage />} />
            <Route path="transfers/status/:ref" element={<TransfersPage />} />

            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:ref" element={<HistoryPage />} />

            <Route
              path="chat"
              element={
                <div className="p-8">Chat Deep Link view placeholder</div>
              }
            />
            <Route
              path="chat/:threadId"
              element={
                <div className="p-8">Chat Deep Link view placeholder</div>
              }
            />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
