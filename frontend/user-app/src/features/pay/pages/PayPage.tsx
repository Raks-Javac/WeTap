import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    CreditCard,
    Loader2,
    ShieldAlert,
    Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../core/api";

const PayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref } = useParams();

  // Determine logical state from URL path
  const scanState = useMemo(() => {
    if (location.pathname.includes("/pay/preview")) return "detected";
    if (location.pathname.includes("/pay/pin")) return "pin";
    if (location.pathname.includes("/pay/status")) return "success";
    return "scanning"; // default /app/tap
  }, [location.pathname]);

  const [isActivelyScanning, setIsActivelyScanning] = useState(false);
  const [pin, setPin] = useState("");

  const paymentMutation = useMutation({
    mutationFn: api.bills.pay,
    onSuccess: (data: any) => {
      navigate(`/app/pay/status/${data.id}`);
    },
  });

  // Tap Scan simulation
  useEffect(() => {
    if (scanState === "scanning") {
      const startTimer = setTimeout(() => setIsActivelyScanning(true), 1000);
      const detectTimer = setTimeout(() => {
        setIsActivelyScanning(false);
        navigate("/app/pay/preview");
      }, 4000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(detectTimer);
      };
    }
  }, [scanState, navigate]);

  // Simulate PIN confirmation
  useEffect(() => {
    if (scanState === "pin" && pin.length === 4) {
      paymentMutation.mutate({
        amount: 14500,
        merchant: "NextGen Supermarket",
      });
    }
  }, [pin, scanState]);

  const PinPad = () => (
    <div className="mt-8 mb-4">
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
            className="w-4 h-4 rounded-full border border-[var(--color-border)]"
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "←"].map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === "C") setPin("");
              else if (key === "←") setPin((prev) => prev.slice(0, -1));
              else if (pin.length < 4) setPin((prev) => prev + String(key));
            }}
            className="h-16 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-xl font-bold transition-colors active:scale-95"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      <AnimatePresence mode="wait">
        {/* State 1: Scanning */}
        {scanState === "scanning" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
              {isActivelyScanning && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-brand-primary"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute inset-[-20%] rounded-full border border-brand-accent"
                  />
                </>
              )}
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                <Wifi
                  size={40}
                  className={isActivelyScanning ? "animate-pulse" : ""}
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {!isActivelyScanning ? "Ready to Scan" : "Reading NFC Payload..."}
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Hold your device near the merchant terminal
            </p>
          </motion.div>
        )}

        {/* State 2: Preview Drawer */}
        {scanState === "detected" && (
          <motion.div
            key="detected"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel w-full max-w-md p-8"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center mb-4 text-2xl">
                🏪
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">
                Pay NextGen Supermarket
              </h3>
              <p className="text-4xl font-extrabold text-gradient">
                ₦14,500.00
              </p>
            </div>

            <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard className="text-brand-primary" />
                <div>
                  <p className="font-semibold text-sm">Virtual Card</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    •••• 4829
                  </p>
                </div>
              </div>
              <button className="text-sm font-semibold text-brand-primary">
                Change
              </button>
            </div>

            <div className="flex gap-4">
              <button
                disabled={paymentMutation.isPending}
                onClick={() =>
                  paymentMutation.mutate({
                    amount: 14500,
                    merchant: "NextGen Supermarket",
                  })
                }
                className="flex-1 flex justify-center py-4 border border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-primary/10 transition disabled:opacity-50"
              >
                {paymentMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "1-Tap (Auto)"
                )}
              </button>
              <button
                disabled={paymentMutation.isPending}
                onClick={() => navigate("/app/pay/pin")}
                className="flex-1 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg shadow-blue-500/30 transition disabled:opacity-50"
              >
                2-Tap (PIN)
              </button>
            </div>

            <p className="text-xs text-center text-[var(--color-text-secondary)] mt-6 flex justify-center items-center gap-1">
              <ShieldAlert size={14} /> End-to-end encrypted transaction
            </p>
          </motion.div>
        )}

        {/* State 3: PIN Input */}
        {scanState === "pin" && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel w-full max-w-md p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Confirm Payment</h3>
            <p className="text-[var(--color-text-secondary)]">
              Enter PIN to authorize ₦14,500.00
            </p>
            {paymentMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2
                  size={40}
                  className="text-brand-primary animate-spin"
                />
                <p className="text-[var(--color-text-secondary)] font-medium">
                  Processing...
                </p>
              </div>
            ) : (
              <PinPad />
            )}
          </motion.div>
        )}

        {/* State 4: Success Cinematic */}
        {scanState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                damping: 10,
                mass: 0.75,
                stiffness: 100,
              }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/30"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-xl text-[var(--color-text-secondary)] mb-2">
              ₦14,500.00 paid to NextGen Supermarket
            </p>
            <div className="bg-[var(--color-bg-secondary)] px-4 py-2 rounded-lg font-mono text-xs text-[var(--color-text-tertiary)] mb-8">
              Ref: {ref || "SIMULATED-TXN"}
            </div>

            <button
              onClick={() => navigate("/app/home")}
              className="py-3 px-8 glass-panel font-semibold hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayPage;
