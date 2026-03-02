import { motion } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnboardingModePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full justify-center"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gradient tracking-tight">
          Payment Preference
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-sm mx-auto">
          How do you prefer to authorize NFC transactions? You can change this
          later in settings.
        </p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <motion.button
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            backgroundColor: "var(--color-bg-secondary)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/onboarding/add-card")}
          className="w-full p-6 glass-panel flex items-start gap-5 text-left border-2 border-transparent hover:border-brand-primary transition-all group relative overflow-hidden shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 shadow-inner">
            <Zap
              size={28}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl group-hover:text-brand-primary transition-colors tracking-tight">
              One-Tap (Speed)
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              Tap and go instantly. Best for low amount transactions under
              ₦10,000.
            </p>
          </div>
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            backgroundColor: "var(--color-bg-secondary)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/onboarding/add-card")}
          className="w-full p-6 glass-panel flex items-start gap-5 text-left border-2 border-transparent hover:border-brand-secondary transition-all group relative overflow-hidden shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck
              size={28}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl group-hover:text-emerald-500 transition-colors tracking-tight">
              Two-Tap (PIN Secured)
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              Tap to preview, enter your secure PIN, and tap again to confirm.
            </p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OnboardingModePage;
