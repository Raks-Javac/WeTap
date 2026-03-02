import { motion } from "framer-motion";
import { Bot, CreditCard, Receipt, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "One-Tap Payments",
    desc: "Immediate secure charge with threshold-based biometrics. Zero friction.",
    icon: <Zap size={28} strokeWidth={2} />,
    span: "col-span-1 md:col-span-2",
    color: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/10 text-blue-500",
    border:
      "group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
  },
  {
    title: "Two-Tap Setup",
    desc: "Detailed transaction view requiring PIN confirmation.",
    icon: <ShieldCheck size={28} strokeWidth={2} />,
    span: "col-span-1 md:col-span-1",
    color: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-500",
    border:
      "group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
  },
  {
    title: "Instant Virtual Cards",
    desc: "Generate highly secure, tokenized virtual cards instantly.",
    icon: <CreditCard size={28} strokeWidth={2} />,
    span: "col-span-1 md:col-span-1",
    color: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-500/10 text-purple-500",
    border:
      "group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
  },
  {
    title: "Intelligent AI Transfers",
    desc: "Send money natively using contextual AI chat commands like 'Send 5k to John'.",
    icon: <Bot size={28} strokeWidth={2} />,
    span: "col-span-1 md:col-span-2",
    color: "from-brand-primary/20 via-brand-primary/5 to-transparent",
    iconBg: "bg-brand-primary/10 text-brand-primary",
    border:
      "group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(0,112,243,0.3)]", // using generic primary rgb, tailwind shadow supports arbitrary
  },
  {
    title: "Universal Bill Payments",
    desc: "Airtime, data, electricity, and cable integrations directly connected to your balance.",
    icon: <Receipt size={28} strokeWidth={2} />,
    span: "col-span-1 md:col-span-3",
    color: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-500",
    border:
      "group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
  },
];

const FeatureGrid = () => {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto relative overflow-hidden">
      {/* Exaggerated Background Glows for absolute beauty */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20 relative"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm mb-6 text-sm font-bold tracking-widest uppercase text-brand-primary">
          <Zap size={16} className="text-amber-500" /> Supercharged Platform
        </div>
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-text-primary)] to-[var(--color-text-secondary)] leading-[1.1]">
          Everything you need. <br className="hidden md:block" />{" "}
          <span className="opacity-80">Beautifully integrated.</span>
        </h2>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
          WeTap combines enterprise-grade banking capabilities with a
          hyper-polished, intuitive user interface that makes managing money
          feel completely effortless.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[minmax(280px,auto)]">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: index * 0.1,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1], // Custom snappy spring-like easing
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative overflow-hidden glass-panel rounded-[2rem] p-8 md:p-10 transition-all duration-500 ${feature.span} border border-[var(--color-border)] flex flex-col justify-between ${feature.border} bg-[var(--color-bg-primary)]/40 backdrop-blur-2xl`}
          >
            {/* Soft inner glow gradient that follows hover (simulated by opacity transition) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
            />

            {/* Shimmer effect line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-text-primary)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

            <div
              className={`relative z-10 w-16 h-16 rounded-2xl ${feature.iconBg} shadow-inner flex items-center justify-center mb-auto border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
            >
              {feature.icon}
            </div>

            <div className="relative z-10 mt-8">
              <h3 className="text-2xl font-black mb-3 tracking-tight text-[var(--color-text-primary)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-text-primary)] group-hover:to-[var(--color-text-secondary)] transition-all">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-base leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
