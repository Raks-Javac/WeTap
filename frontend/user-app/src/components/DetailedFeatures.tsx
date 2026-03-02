import { motion } from "framer-motion";
import { ArrowRight, FileText, Send, Smartphone, Zap } from "lucide-react";

const DetailedFeatures = () => {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto overflow-hidden relative">
      {/* Background connecting line pattern or subtle glow could go here */}

      {/* Feature 1: Bills & Utilities */}
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-48 relative">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex-1 space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Zap size={14} /> Lifestyle Integration
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[var(--color-text-primary)] leading-[1.05]">
            Pay bills, buy airtime, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300">
              never skip a beat.
            </span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] font-medium leading-relaxed max-w-md">
            Your lifestyle doesn't pause, neither should your payments.
            Instantly top-up your mobile data, pay electricity bills, and renew
            subscriptions directly from your WeTap balance.
          </p>

          <ul className="space-y-5 pt-4">
            {[
              {
                icon: <Smartphone size={22} className="text-white" />,
                bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
                shadow: "shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)]",
                text: "Instant Airtime & Data Top-ups",
              },
              {
                icon: <FileText size={22} className="text-white" />,
                bg: "bg-gradient-to-br from-emerald-400 to-teal-600",
                shadow: "shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]",
                text: "Zero-fee Utility Bill Payments",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-5 text-lg text-[var(--color-text-primary)] font-bold group cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.shadow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-text-primary)] group-hover:to-[var(--color-text-secondary)] transition-all">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Conceptual UI Mock for Bills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="flex-1 w-full perspective-1000 relative"
        >
          {/* Intense Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none -z-10 mix-blend-screen"
          />

          <div className="relative glass-panel p-4 sm:p-6 rounded-[3rem] border border-white/20 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.4)] overflow-hidden aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl transform-gpu">
            {/* Mock App UI */}
            <div className="w-[280px] sm:w-[320px] bg-[var(--color-bg-primary)] rounded-[2.5rem] shadow-2xl border-8 border-[var(--color-bg-secondary)]/80 p-6 z-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex justify-between items-center mb-8">
                <div className="h-5 w-28 bg-[var(--color-text-primary)] rounded-full"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] shadow-inner"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border border-blue-500/20 shadow-sm hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <Smartphone size={22} />
                  </div>
                  <div className="h-2.5 w-14 bg-blue-500/60 rounded-full"></div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border border-emerald-500/20 shadow-sm hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg">
                    <FileText size={22} />
                  </div>
                  <div className="h-2.5 w-14 bg-emerald-500/60 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-16 w-full bg-[var(--color-bg-secondary)] rounded-[1.25rem] flex items-center px-4 gap-4 border border-transparent hover:border-[var(--color-border)] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 w-20 bg-[var(--color-text-primary)] rounded-full"></div>
                    <div className="h-1.5 w-12 bg-[var(--color-text-secondary)] rounded-full"></div>
                  </div>
                  <div className="h-3 w-10 bg-[var(--color-text-primary)] rounded-full"></div>
                </div>
                <div className="h-16 w-full bg-[var(--color-bg-secondary)] rounded-[1.25rem] flex items-center px-4 gap-4 border border-transparent hover:border-[var(--color-border)] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 w-24 bg-[var(--color-text-primary)] rounded-full"></div>
                    <div className="h-1.5 w-16 bg-[var(--color-text-secondary)] rounded-full"></div>
                  </div>
                  <div className="h-3 w-12 bg-[var(--color-text-primary)] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-10 -right-6 lg:-right-10 glass-panel p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] border border-white/20 flex items-center gap-4 z-20 backdrop-blur-xl bg-white/10 dark:bg-black/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner border border-emerald-300/30">
                ✓
              </div>
              <div>
                <div className="h-2.5 w-20 bg-[var(--color-text-primary)] rounded-full mb-2 shadow-sm"></div>
                <div className="h-1.5 w-12 bg-[var(--color-text-secondary)] rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Feature 2: Transfers */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
        {/* Conceptual UI Mock for Transfers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.1 }}
          className="flex-1 w-full perspective-1000 relative"
        >
          {/* Intense Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-accent/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 blur-[90px] rounded-full pointer-events-none -z-10 mix-blend-screen"
          />

          <div className="relative glass-panel p-4 sm:p-6 rounded-[3rem] border border-white/20 shadow-[0_20px_80px_-20px_rgba(236,72,153,0.3)] overflow-hidden aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl transform-gpu">
            {/* Mock App UI */}
            <div className="w-[280px] sm:w-[320px] bg-[var(--color-bg-primary)] rounded-[2.5rem] shadow-2xl border-8 border-[var(--color-bg-secondary)]/80 p-6 z-10 relative flex flex-col overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex flex-col items-center mb-10 pt-6">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-accent via-purple-500 to-indigo-500 mb-5 p-[3px] shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 rounded-full border border-white/30" />
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-[var(--color-bg-primary)] relative z-10"
                  />
                </div>
                <div className="h-5 w-40 bg-[var(--color-text-primary)] rounded-full mb-2.5"></div>
                <div className="h-2 w-24 bg-[var(--color-text-secondary)] rounded-full"></div>
              </div>

              <div className="flex justify-center items-end gap-1.5 mb-10">
                <span className="text-3xl font-bold text-[var(--color-text-secondary)] mb-1">
                  ₦
                </span>
                <span className="text-6xl font-black text-[var(--color-text-primary)] tracking-tighter mix-blend-luminosity">
                  50,000
                </span>
              </div>

              <div className="w-full py-4.5 rounded-[1.25rem] bg-gradient-to-r from-brand-accent to-purple-500 text-center font-black text-white shadow-[0_10px_30px_-10px_rgba(236,72,153,0.6)] mt-auto flex items-center justify-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
                Send Money <Send size={18} className="animate-pulse" />
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-10 -left-6 lg:-left-10 glass-panel p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(236,72,153,0.4)] border border-white/20 flex items-center gap-4 z-20 backdrop-blur-xl bg-white/10 dark:bg-black/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-accent/20 to-purple-500/20 rounded-full flex items-center justify-center text-brand-accent border border-brand-accent/30 shadow-inner">
                <Send size={20} className="drop-shadow-md" />
              </div>
              <div>
                <div className="h-2.5 w-24 bg-[var(--color-text-primary)] rounded-full mb-2 shadow-sm"></div>
                <div className="h-1.5 w-16 bg-[var(--color-text-secondary)] rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex-1 space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.15)]">
            <Send size={14} /> Borderless Transfers
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[var(--color-text-primary)] leading-[1.05]">
            Send money globally, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-pink-500 to-purple-500">
              in a single tap.
            </span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] font-medium leading-relaxed max-w-md">
            Whether you're sending to a WeTap user or transferring directly to a
            local bank account, experience lightning-fast settlements with zero
            hidden fees. Just enter the amount and swipe.
          </p>

          <div className="pt-6">
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-3 font-bold text-brand-accent hover:text-purple-400 transition-colors group text-xl"
            >
              Explore Transfers{" "}
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 group-hover:translate-x-2 transition-all">
                <ArrowRight size={20} />
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DetailedFeatures;
