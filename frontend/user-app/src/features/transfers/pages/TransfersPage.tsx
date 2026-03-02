import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    Building,
    CheckCircle2,
    Loader2,
    Send,
    ShieldAlert,
    User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../core/api";

const BANKS = [
  "Access Bank",
  "Guaranty Trust Bank",
  "Zenith Bank",
  "First Bank of Nigeria",
  "UBA",
];

const TransfersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref } = useParams();

  // Determine stage from URL
  const stage = useMemo(() => {
    if (location.pathname.includes("/status")) return "status";
    if (location.pathname.includes("/confirm")) return "confirm";
    return "new"; // default
  }, [location.pathname]);

  // Form State
  const [tab, setTab] = useState<"p2p" | "bank">("bank");
  const [bank, setBank] = useState(BANKS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");

  const transferData = location.state || {
    type: tab,
    bank: tab === "bank" ? bank : "WeTap Network",
    account,
    amount: Number(amount),
    narration,
  };

  const transferMutation = useMutation({
    mutationFn: api.transactions.transfer,
    onSuccess: (data: any) => {
      navigate(`/app/transfers/status/${data.id}`, {
        state: { ...transferData, id: data.id },
      });
    },
  });

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !account) return;
    navigate("/app/transfers/confirm", {
      state: {
        type: tab,
        bank: tab === "bank" ? bank : "WeTap Network",
        account,
        amount: Number(amount),
        narration,
      },
    });
  };

  const handleConfirm = () => {
    transferMutation.mutate({
      type: transferData.type === "bank" ? "Bank Transfer" : "WeTap Transfer",
      name: transferData.account,
      amount: -transferData.amount,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto relative">
      <header>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {stage === "status"
            ? "Transfer Successful"
            : stage === "confirm"
              ? "Confirm Transfer"
              : "Send Money"}
        </h1>
        {stage === "new" && (
          <p className="text-[var(--color-text-secondary)] mt-1">
            Send money to any bank or WeTap user.
          </p>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* Stage 1: New Transfer Form */}
        {stage === "new" && (
          <motion.div
            key="new"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="space-y-5"
          >
            {/* Tabs */}
            <div className="flex bg-[var(--color-bg-secondary)] p-1 rounded-2xl border border-[var(--color-border)] shadow-sm">
              <button
                onClick={() => setTab("bank")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  tab === "bank"
                    ? "bg-[var(--color-bg-primary)] shadow-md text-brand-primary"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                }`}
              >
                <Building size={16} /> To Bank Account
              </button>
              <button
                onClick={() => setTab("p2p")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  tab === "p2p"
                    ? "bg-[var(--color-bg-primary)] shadow-md text-brand-primary"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                }`}
              >
                <User size={16} /> WeTap Network
              </button>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border-[1.5px] border-[var(--color-border)]">
              <form onSubmit={handlePreview} className="space-y-5">
                {tab === "bank" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                        Select Bank
                      </label>
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all appearance-none cursor-pointer"
                      >
                        {BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="0000000000"
                        className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all tracking-wide"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                      WeTap ID or Phone Number
                    </label>
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="@username or 090..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all tracking-wide"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] font-bold text-xl">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-5 py-5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-3xl font-extrabold transition-all tracking-tight"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                    Narration (Optional)
                  </label>
                  <input
                    type="text"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="What is this for?"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: account && amount ? 1.01 : 1 }}
                  whileTap={{ scale: account && amount ? 0.98 : 1 }}
                  type="submit"
                  disabled={!account || !amount}
                  className="w-full py-4 mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none text-sm"
                >
                  Review Transfer <Send size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Confirm Transfer */}
        {stage === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel max-w-md mx-auto p-8"
          >
            <button
              onClick={() => navigate("/app/transfers/new")}
              className="text-sm font-semibold flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-brand-primary mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Edit Details
            </button>

            <div className="text-center mb-8">
              <p className="text-[var(--color-text-secondary)] uppercase tracking-widest text-xs font-bold mb-2">
                Sending
              </p>
              <h2 className="text-5xl font-extrabold text-gradient mb-2">
                ₦{transferData.amount.toLocaleString()}
              </h2>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                Fee: ₦10.50
              </p>
            </div>

            <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-8 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-secondary)]">
                  Recipient
                </span>
                <div className="text-right">
                  <p className="font-bold">{transferData.account}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {transferData.bank}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)]">
                  Narration
                </span>
                <span className="font-medium text-right max-w-[150px] truncate">
                  {transferData.narration || "N/A"}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={transferMutation.isPending}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {transferMutation.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Confirm & Send"
              )}
            </button>

            <p className="text-xs text-center text-[var(--color-text-secondary)] mt-4 flex justify-center items-center gap-1">
              <ShieldAlert size={14} /> Secured by WeTap Identity
            </p>
          </motion.div>
        )}

        {/* Stage 3: Status */}
        {stage === "status" && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-md mx-auto p-10 flex flex-col items-center text-center"
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
            <h2 className="text-3xl font-bold mb-2">Transfer Sent!</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              You sent{" "}
              <strong className="text-[var(--color-text-primary)]">
                ₦{transferData.amount.toLocaleString()}
              </strong>{" "}
              to {transferData.account}.
            </p>

            <div className="bg-[var(--color-bg-secondary)] px-4 py-2 rounded-lg font-mono text-xs text-[var(--color-text-tertiary)] mb-8">
              Ref: {ref || "SIMULATED-TXN"}
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate("/app/transfers/new")}
                className="flex-1 py-3 px-4 glass-panel font-semibold hover:bg-[var(--color-bg-secondary)] transition-colors text-sm"
              >
                Send Another
              </button>
              <button
                onClick={() => navigate("/app/home")}
                className="flex-1 py-3 px-4 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-blue-500/20 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransfersPage;
