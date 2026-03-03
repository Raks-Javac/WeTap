import { motion } from "framer-motion";
import { CreditCard, Monitor, Moon, Server, Shield, Sun } from "lucide-react";
import { useGlobalStore } from "../../../core/store";
import CompleteProfileCard from "../components/CompleteProfileCard";

const SettingsPage = () => {
  const { theme, environment, setTheme, setEnvironment } = useGlobalStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Settings
        </h1>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
          Manage your application preferences and environment.
        </p>
      </motion.header>

      {/* KYC Progress Tracker */}
      <motion.div variants={itemVariants}>
        <CompleteProfileCard />
      </motion.div>

      {/* Appearance */}
      <motion.section
        variants={itemVariants}
        className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border-[1.5px] border-[var(--color-border)] shadow-sm"
      >
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] shadow-inner flex items-center justify-center">
            {theme === "dark" ? (
              <Moon size={20} className="text-brand-primary" />
            ) : (
              <Sun size={20} className="text-brand-primary" />
            )}
          </div>
          Appearance
        </h2>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            onClick={() => setTheme("light")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 ${
              theme === "light"
                ? "border-brand-primary bg-brand-primary/10 shadow-md shadow-brand-primary/10"
                : "border-[var(--color-border)] hover:border-brand-primary/50 bg-[var(--color-bg-secondary)] shadow-inner"
            }`}
          >
            <Sun
              size={24}
              className={
                theme === "light"
                  ? "text-brand-primary"
                  : "text-[var(--color-text-tertiary)]"
              }
            />
            <span
              className={`font-bold text-sm tracking-tight ${theme === "light" ? "text-brand-primary" : "text-[var(--color-text-secondary)]"}`}
            >
              Light Mode
            </span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 ${
              theme === "dark"
                ? "border-brand-primary bg-brand-primary/10 shadow-md shadow-brand-primary/10"
                : "border-[var(--color-border)] hover:border-brand-primary/50 bg-[var(--color-bg-secondary)] shadow-inner"
            }`}
          >
            <Moon
              size={24}
              className={
                theme === "dark"
                  ? "text-brand-primary"
                  : "text-[var(--color-text-tertiary)]"
              }
            />
            <span
              className={`font-bold text-sm tracking-tight ${theme === "dark" ? "text-brand-primary" : "text-[var(--color-text-secondary)]"}`}
            >
              Dark Mode
            </span>
          </button>
        </div>
      </motion.section>

      {/* Environment Target (Mock/API) */}
      <motion.section
        variants={itemVariants}
        className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border-[1.5px] border-[var(--color-border)] shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] shadow-inner flex items-center justify-center">
              <Server size={20} className="text-brand-primary" />
            </div>
            Network Environment Target
          </h2>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] pl-[52px]">
            Switching environments will change the API base target and alter the
            UI accent color.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {(["dev", "uat", "staging", "prod"] as const).map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
                environment === env
                  ? "border-brand-primary bg-[var(--color-bg-secondary)] shadow-sm shadow-brand-primary/10"
                  : "border-transparent bg-[var(--color-bg-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg-primary)] shadow-inner"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-bg-primary)] shadow-sm border border-[var(--color-border)]`}
                >
                  <Monitor
                    size={14}
                    className={
                      env === "dev"
                        ? "text-purple-500"
                      : env === "uat"
                        ? "text-blue-500"
                        : env === "staging"
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }
                  />
                </div>
                <span
                  className={`font-bold text-sm uppercase tracking-wide ${environment === env ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}
                >
                  {env} Environment
                </span>
              </div>
              {environment === env && (
                <span className="text-[10px] font-black tracking-wider px-2.5 py-1.5 bg-brand-primary text-white rounded-md uppercase">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Security Preferences */}
      <motion.section
        variants={itemVariants}
        className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-[var(--color-border)] shadow-sm opacity-60 grayscale-[0.5] pointer-events-none"
      >
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] shadow-inner flex items-center justify-center">
            <Shield size={20} className="text-[var(--color-text-secondary)]" />
          </div>
          Security{" "}
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded-md ml-2 border border-[var(--color-border)]">
            Coming Soon
          </span>
        </h2>

        <div className="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center shadow-sm">
              <CreditCard
                size={14}
                className="text-[var(--color-text-secondary)]"
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--color-text-secondary)]">
              Require Biometrics for Tap Pay
            </span>
          </div>

          <div className="w-10 h-6 bg-[var(--color-border)] rounded-full relative shadow-inner">
            <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SettingsPage;
