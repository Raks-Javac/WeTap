import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../core/api";
import { useToast } from "../../../components/toast/ToastProvider";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { showToast } = useToast();

  const emailMutation = useMutation({
    mutationFn: () => api.auth.requestOtp(email),
    onSuccess: (data: any) => {
      showToast(data?.debug_otp ? `OTP: ${data.debug_otp}` : "OTP sent", "info");
      setStep(2);
    },
    onError: (err: any) => {
      showToast(err.message || "Could not send OTP", "error");
    },
  });

  const authMutation = useMutation({
    mutationFn: () => api.auth.login({ email, otp }),
    onSuccess: (data: any) => {
      showToast("Authentication successful", "success");
      navigate(data?.is_new ? "/onboarding/mode" : "/app/home");
    },
    onError: (err: any) => {
      showToast(err.message || "Authentication failed", "error");
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    emailMutation.mutate();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("OTP must be 4 digits");
      return;
    }
    authMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-accent opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        key={location.pathname}
        className="glass-panel w-full max-w-md p-8 relative z-10 min-h-[400px] flex flex-col justify-center"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gradient mb-2">
                  WeTap.
                </h1>
                <p className="text-[var(--color-text-secondary)] font-medium">
                  Enter your email to get started.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-lg"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={emailMutation.isPending || !email}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all mt-4 disabled:opacity-50 flex justify-center items-center"
                >
                  {emailMutation.isPending ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Continue"
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full"
            >
              <button
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="text-center mb-8 mt-4">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                  <KeyRound size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Check your Email</h2>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  We sent a 4-digit code to <br />
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {email}
                  </span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full text-center tracking-[1em] py-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-3xl font-mono"
                    required
                    autoFocus
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={authMutation.isPending || otp.length !== 4}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {authMutation.isPending ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Verify & Sign In"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
