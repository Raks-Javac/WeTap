import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Intense Background Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-brand-primary/30 to-brand-accent/30 rounded-full blur-[120px] opacity-50 pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content Area */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-left z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 backdrop-blur-md mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ml-2">
              WeTap Platform 2.0 is Live
            </span>
          </motion.div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tighter text-[var(--color-text-primary)]">
            Tap. Pay. <br />
            <span className="text-gradient drop-shadow-sm">Done.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-lg leading-relaxed font-medium">
            Experience the future of finance. An ultra-secure NFC payment
            network, intelligent AI chat assistance, and gorgeous card
            management—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link to="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] rounded-full font-bold shadow-2xl transition-all w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
              >
                Join the Network <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/auth/login">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "var(--color-bg-secondary)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent border-2 border-[var(--color-border)] text-[var(--color-text-primary)] rounded-full font-bold transition-all w-full sm:w-auto text-lg"
              >
                Sign In
              </motion.button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 text-[var(--color-text-secondary)] text-sm font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" /> Bank-Grade
              Security
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Instant Settlements
            </div>
          </div>
        </motion.div>

        {/* Right Floating Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative z-10 hidden lg:block perspective-1000"
        >
          {/* Main Floating Glass Panel simulating the Dashboard */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative w-full aspect-[4/3] rounded-[2.5rem] bg-[var(--bg-glass)] backdrop-blur-2xl border-[1.5px] border-[var(--border-glass)] shadow-2xl p-6 flex flex-col overflow-hidden"
          >
            {/* Header Mock */}
            <div className="flex justify-between items-center mb-8 border-b border-[var(--border-glass)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent p-[2px]">
                  <div className="w-full h-full bg-[var(--color-bg-primary)] rounded-full border-2 border-transparent"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-[var(--color-text-primary)]/20 rounded-full mb-1"></div>
                  <div className="h-2 w-16 bg-[var(--color-text-secondary)]/20 rounded-full"></div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--color-text-primary)]/10"></div>
            </div>

            {/* Balance Mock */}
            <div className="mb-8">
              <div className="h-3 w-20 bg-[var(--color-text-secondary)]/20 rounded-full mb-3"></div>
              <div className="h-10 w-48 bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-primary)]/70 rounded-lg"></div>
            </div>

            {/* Cards Mock */}
            <div className="flex gap-4">
              <motion.div
                animate={{ rotateZ: [0, 2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="w-48 h-28 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-t border-white/20 shadow-xl p-4 flex flex-col justify-between"
              >
                <div className="w-full flex justify-between">
                  <span className="text-white/80 font-black text-xs">
                    VIRTUAL
                  </span>
                  <div className="flex">
                    <div className="w-4 h-4 bg-red-500/80 rounded-full mix-blend-screen -mr-1"></div>
                    <div className="w-4 h-4 bg-yellow-500/80 rounded-full mix-blend-screen"></div>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full"></div>
              </motion.div>

              <div className="w-48 h-28 rounded-2xl border-2 border-dashed border-[var(--color-text-primary)]/20 flex items-center justify-center flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-text-primary)]/10 flex items-center justify-center">
                  <span className="text-[var(--color-text-primary)] text-xl">
                    +
                  </span>
                </div>
                <div className="h-2 w-16 bg-[var(--color-text-primary)]/20 rounded-full"></div>
              </div>
            </div>

            {/* Floating Overlays to add depth */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
            />
          </motion.div>

          {/* Small floating element */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute -right-8 top-1/4 p-4 rounded-2xl bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-glass)] shadow-xl hidden xl:flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">
                Verified Safe
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Zero-knowledge proofs
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
