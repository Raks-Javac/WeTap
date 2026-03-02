import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../core/api";

const OnboardingAddCardPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: api.cards.tokenize,
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate("/onboarding/pin");
      }, 2000);
    },
  });

  return (
    <div className="flex flex-col h-full justify-center">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white mb-6 shadow-xl shadow-green-500/30"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-3xl font-extrabold mb-2 text-gradient">
              Card Provisioned
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Your secure virtual card is ready for tap payments.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              type: "spring" as const,
              stiffness: 300,
              damping: 24,
            }}
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gradient tracking-tight">
                Issue Virtual Card
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-sm mx-auto">
                Generate a secure, dynamic virtual token linked to your WeTap
                wallet to start making NFC payments.
              </p>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center gap-5 mb-10 text-white shadow-xl shadow-blue-500/20 overflow-hidden group">
              {/* Animated Background Highlights */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner relative z-10">
                <CreditCard size={28} className="text-white drop-shadow-md" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl tracking-tight mb-0.5">
                  WeTap Virtual VTP
                </h3>
                <p className="text-sm text-white/80 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={16} /> PCI-DSS Compliant
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center disabled:opacity-50 text-lg"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Generate New Card"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingAddCardPage;
