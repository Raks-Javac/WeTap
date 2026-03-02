import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    ChevronRight,
    Loader2,
    ShieldCheck,
    User,
} from "lucide-react";
import { useState } from "react";

const CompleteProfileCard = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bvn: "",
    address: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: () => {
      setStep(3); // Completed step
    },
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      mutation.mutate();
    }
  };

  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-6 border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
              Profile Verified
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Your tier limits have been upgraded. Tier 3 Unlocked.
            </p>
          </div>
        </div>
        <ShieldCheck className="text-emerald-500 opacity-50" size={48} />
      </motion.div>
    );
  }

  if (step === 0) {
    return (
      <section className="glass-panel p-6 relative overflow-hidden group border-l-4 border-l-brand-primary">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <User size={20} className="text-brand-primary" />
              Complete Your Profile
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Unlock higher transaction limits and full account features by
              completing KYC.
            </p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-text-secondary)] border border-[var(--color-border)]">
            0/2 Steps
          </div>
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-between items-center px-6 relative z-10"
        >
          <span>Start Verification</span>
          <ChevronRight size={20} />
        </button>
      </section>
    );
  }

  return (
    <section className="glass-panel p-6 border-brand-primary border">
      <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-border)] pb-4">
        <button
          onClick={() => setStep(0)}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold flex-1">
          {step === 1 ? "Personal Details" : "Identity Verification"}
        </h2>
        <span className="text-sm font-semibold text-brand-primary">
          Step {step} of 2
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleNext}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Legal Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="As it appears on your ID"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+234 XXX XXXX"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Residential Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Full address"
                  rows={2}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border)] mb-4">
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  To verify your identity, please provide your Bank Verification
                  Number (BVN) or National Identity Number (NIN).
                </p>
                <div className="flex items-center gap-2 text-xs text-brand-primary font-medium">
                  <ShieldCheck size={14} /> Data is secured and encrypted
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  BVN / NIN
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.bvn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bvn: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="11-digit number"
                  minLength={11}
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary transition-colors tracking-widest font-mono"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 mt-6 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition-all flex justify-center items-center disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={24} />
            ) : step === 1 ? (
              "Continue to Identity"
            ) : (
              "Submit Verification"
            )}
          </button>
        </motion.form>
      </AnimatePresence>
    </section>
  );
};

export default CompleteProfileCard;
