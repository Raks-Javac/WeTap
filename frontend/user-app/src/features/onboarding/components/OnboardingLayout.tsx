import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const OnboardingLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-accent opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-lg p-8 relative z-10"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingLayout;
