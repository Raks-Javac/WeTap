import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ChevronRight,
    Lock,
    Moon,
    ShieldAlert,
    Sparkles,
    Sun,
    User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../components/toast/ToastProvider";
import { useAdminStore } from "../../../core/store";
import { adminApi } from "../../../services/adminApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, theme, setTheme } = useAdminStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: adminApi.login,
    onSuccess: () => {
      login();
      showToast("Admin login successful", "success");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Access Denied: Invalid Security Credentials");
      showToast(err.message || "Login failed", "error");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email: username, password });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 selection:bg-brand-primary/30">
      {/* Cinematic Background Atmosphere */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-primary/10 rounded-full blur-[160px] pointer-events-none mix-blend-screen animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[180px] pointer-events-none mix-blend-screen animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />

      {/* Floating Particles/Glows */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-32 h-32 bg-brand-accent/20 rounded-full blur-[60px] pointer-events-none"
      />

      {/* Futuristic Header Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 w-full p-8 flex justify-between items-center z-20 max-w-7xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-xl shadow-brand-primary/20 rotate-3">
            <ShieldAlert size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter text-[var(--color-text-primary)] leading-none display-font">
              WeTap<span className="text-brand-primary">.</span>
            </h2>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-text-tertiary)] uppercase mt-0.5">
              Control Panel
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:text-brand-primary shadow-sm transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] border-[1.5px] border-[var(--color-border)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-[var(--color-bg-primary)]/60 backdrop-blur-3xl relative overflow-hidden group">
          {/* Top Logo Reveal inside card */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 mb-4">
                <Sparkles
                  size={14}
                  className="text-brand-primary animate-pulse"
                />
                <span className="text-[10px] font-bold tracking-[0.1em] text-brand-primary uppercase">
                  Secure Admin Auth
                </span>
              </div>
              <h1 className="text-4xl font-black text-gradient display-font tracking-tight">
                WeTap Admin
                <span className="text-[var(--color-text-primary)]">.</span>
              </h1>
            </motion.div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2.5 ml-1 display-font">
                  Administrator ID
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] group-focus-within:text-brand-primary transition-colors">
                    <User size={22} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-16 pl-13 pr-4 rounded-2xl bg-[var(--color-bg-secondary)]/80 border-[1.5px] border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-lg font-medium"
                    placeholder="Enter admin username"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2.5 ml-1 display-font">
                  Secret Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] group-focus-within:text-brand-primary transition-colors">
                    <Lock size={22} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 pl-13 pr-4 rounded-2xl bg-[var(--color-bg-secondary)]/80 border-[1.5px] border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-lg tracking-[0.3em]"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center gap-3 text-red-500 text-sm font-bold bg-red-500/5 p-4 rounded-2xl border border-red-500/10"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-16 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl font-black text-lg shadow-[0_12px_24px_-8px_rgba(59,130,246,0.5)] flex justify-center items-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] skew-x-12" />
              {loginMutation.isPending ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify Credentials
                  <ChevronRight
                    size={22}
                    className="group-hover/btn:translate-x-1.5 transition-transform"
                  />
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 pt-6 border-t border-[var(--color-border)] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
                Secure Node
              </span>
            </div>
            <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest opacity-50">
              v2.4.0-STABLE
            </span>
          </motion.div>
        </div>

        {/* Helper footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8 text-[var(--color-text-tertiary)] text-xs font-medium"
        >
          Protected by WeTap Enterprise Security Gateway.
          <br />
          Unauthorized access is prohibited.
        </motion.p>
      </motion.div>
    </div>
  );
}
