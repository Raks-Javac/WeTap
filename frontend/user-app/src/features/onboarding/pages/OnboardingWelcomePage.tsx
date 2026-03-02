import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnboardingWelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 text-brand-primary relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-brand-primary"
        />
        <Wifi size={40} />
      </div>

      <h1 className="text-3xl font-extrabold mb-4">Welcome to WeTap</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        The most secure, ultra-fast NFC payment platform built for the future of
        finance. Let's get your account set up.
      </p>

      <button
        onClick={() => navigate("/onboarding/mode")}
        className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
      >
        Get Started
      </button>
    </div>
  );
};

export default OnboardingWelcomePage;
