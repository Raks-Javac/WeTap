import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ExternalLink, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../core/api";

const AddMoneyPage = () => {
  const navigate = useNavigate();
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.users.dashboard,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <motion.header
        variants={itemVariants}
        className="mb-8 relative flex items-center justify-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Add Money
        </h1>
      </motion.header>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-2">
          Top up methods
        </h2>

        <button className="w-full glass-panel p-5 rounded-3xl flex items-center justify-between border-[1.5px] border-[var(--color-border)] hover:border-brand-primary/50 transition-all hover:-translate-y-0.5 group text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-inner text-blue-500 group-hover:scale-105 transition-transform">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-base tracking-tight mb-0.5">
                Bank Card
              </h3>
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Top up instantly with any debit or credit card.
              </p>
            </div>
          </div>
        </button>

        <button className="w-full glass-panel p-5 rounded-3xl flex items-center justify-between border-[1.5px] border-[var(--color-border)] hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 group text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner text-emerald-500 group-hover:scale-105 transition-transform">
              <ExternalLink size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-base tracking-tight mb-0.5">
                Bank Transfer
              </h3>
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Send money to your unique WeTap account number.
              </p>
            </div>
          </div>
        </button>

        <button className="w-full glass-panel p-5 rounded-3xl flex items-center justify-between border-[1.5px] border-[var(--color-border)] hover:border-purple-500/50 transition-all hover:-translate-y-0.5 group text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shadow-inner text-purple-500 group-hover:scale-105 transition-transform">
              <QrCode size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-base tracking-tight mb-0.5">
                Receive via QR
              </h3>
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Show your QR code to another WeTap user.
              </p>
            </div>
          </div>
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-[1.5px] border-[var(--color-border)] shadow-sm bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">
            Your WeTap Account
          </h3>
          <p className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] mb-1">
            {dashboard?.wallet?.virtual_account?.number || "N/A"}
          </p>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-6">
            {dashboard?.wallet?.virtual_account?.bank || "WeTap Bank"}
          </p>
          <button className="px-6 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors active:scale-95 shadow-sm">
            Copy Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddMoneyPage;
