import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingPinPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      setIsProcessing(true);
      setTimeout(() => {
        // Save PIN or send to backend here in real app
        navigate("/app/home");
      }, 1500);
    }
  }, [pin, navigate]);

  return (
    <div className="flex flex-col h-full justify-center">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="text-center w-full max-w-sm mx-auto"
      >
        <div className="w-16 h-16 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>

        <h1 className="text-3xl font-extrabold mb-3 text-gradient tracking-tight">
          Create your PIN
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mb-10">
          Set a secure 4-digit PIN to authorize your 2-Tap NFC payments and
          transfers.
        </p>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Loader2 size={40} className="text-brand-primary animate-spin" />
            <p className="text-brand-primary font-medium animate-pulse">
              Securing your wallet...
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex justify-center gap-4 mb-10">
              {[1, 2, 3, 4].map((idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    scale: pin.length >= idx ? 1.2 : 1,
                    backgroundColor:
                      pin.length >= idx
                        ? "var(--color-brand-primary)"
                        : "var(--color-bg-tertiary)",
                  }}
                  className="w-4 h-4 rounded-full border border-[var(--color-border)] shadow-inner"
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "←"].map((key) => (
                <button
                  key={key}
                  disabled={isProcessing}
                  onClick={() => {
                    if (key === "C") setPin("");
                    else if (key === "←") setPin((prev) => prev.slice(0, -1));
                    else if (pin.length < 4)
                      setPin((prev) => prev + String(key));
                  }}
                  className="h-16 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-2xl font-bold transition-all active:scale-95 text-[var(--color-text-primary)] shadow-sm"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OnboardingPinPage;
