import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Loader2,
    Phone,
    Tv,
    Wifi,
    Zap,
} from "lucide-react";
import { useMemo, useState, type ReactElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../core/api";
import { useToast } from "../../../components/toast/ToastProvider";

const CATEGORY_META: Record<string, { icon: ReactElement; desc: string }> = {
  airtime: {
    icon: <Phone className="text-blue-500" />,
    desc: "Mobile airtime recharge",
  },
  data: {
    icon: <Wifi className="text-green-500" />,
    desc: "Internet subscription",
  },
  electricity: {
    icon: <Zap className="text-yellow-500" />,
    desc: "Prepaid & postpaid",
  },
  cable: {
    icon: <Tv className="text-purple-500" />,
    desc: "TV subscriptions",
  },
  tv: {
    icon: <Tv className="text-purple-500" />,
    desc: "TV subscriptions",
  },
};

const BillsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, ref } = useParams();
  const { showToast } = useToast();

  // Determine stage from URL
  const stage = useMemo(() => {
    if (location.pathname.includes("/status")) return "status";
    if (location.pathname.includes("/billers/")) return "form";
    return "categories"; // default
  }, [location.pathname]);

  const { data: categories = [] } = useQuery({
    queryKey: ["bill-categories"],
    queryFn: api.bills.categories,
  });

  const activeCategory = categories.find((c: any) => c.code === categoryId);

  const { data: providers = [] } = useQuery({
    queryKey: ["bill-providers", categoryId],
    queryFn: () => api.bills.providers(categoryId || ""),
    enabled: Boolean(categoryId),
  });

  // Form State
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");

  const payMutation = useMutation({
    mutationFn: api.bills.pay,
    onSuccess: (data: any) => {
      showToast("Bill payment completed", "success");
      navigate(
        `/app/bills/status/${data.id}?cat=${activeCategory?.name}&amt=${amount}`,
      );
    },
    onError: (err: any) => {
      showToast(err.message || "Bill payment failed", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !account || !provider) return;
    payMutation.mutate({
      category: activeCategory?.code || "airtime",
      provider,
      account,
      amount: Number(amount),
    });
  };

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
      className="space-y-6 max-w-5xl mx-auto relative"
    >
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          {stage === "status" ? "Payment Successful" : "Pay Bills"}
        </h1>
        {stage !== "status" && (
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
            Settle your utilities instantly with WeTap.
          </p>
        )}
      </motion.header>

      <AnimatePresence mode="wait">
        {/* Stage 1: Categories */}
        {stage === "categories" && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {categories.map((category: any) => (
              <button
                key={category.code}
                onClick={() => navigate(`/app/bills/billers/${category.code}`)}
                className="glass-panel p-5 rounded-3xl flex items-center justify-between text-left border-[1.5px] border-[var(--color-border)] hover:border-brand-primary/50 shadow-sm transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {(CATEGORY_META[category.code]?.icon || <Phone className="text-blue-500" />)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-base tracking-tight mb-0.5">
                      {category.name}
                    </h3>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {CATEGORY_META[category.code]?.desc || "Utility payments"}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                  <ChevronRight
                    size={16}
                    className="text-[var(--color-text-tertiary)] group-hover:text-brand-primary transition-colors"
                  />
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Stage 2: Provider Form */}
        {stage === "form" && activeCategory && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-panel max-w-xl mx-auto p-6 md:p-8 rounded-3xl border-[1.5px] border-[var(--color-border)] shadow-sm"
          >
            <button
              onClick={() => navigate("/app/bills/categories")}
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-brand-primary mb-6 transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back
            </button>

            <h2 className="text-2xl font-extrabold tracking-tight mb-8 flex items-center gap-4">
              <div className="w-14 h-14 bg-[var(--color-bg-secondary)] rounded-2xl flex items-center justify-center shadow-inner">
                {(CATEGORY_META[activeCategory.code]?.icon || <Phone className="text-blue-500" />)}
              </div>
              {activeCategory.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                  Select Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Choose a provider
                  </option>
                  {providers.map((p: any) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                  {activeCategory.code === "airtime" ||
                  activeCategory.code === "data"
                    ? "Phone Number"
                    : "Meter / Smartcard Number"}
                </label>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder={
                    activeCategory.code === "airtime"
                      ? "090XXXXXXXX"
                      : "Enter number"
                  }
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-transparent focus:border-brand-primary focus:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-medium text-sm transition-all tracking-wide"
                  required
                />
              </div>

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

              <motion.button
                whileHover={{ scale: provider && account && amount ? 1.01 : 1 }}
                whileTap={{ scale: provider && account && amount ? 0.98 : 1 }}
                type="submit"
                disabled={
                  payMutation.isPending || !provider || !account || !amount
                }
                className="w-full py-4 mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none text-sm"
              >
                {payMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Pay ₦{amount ? Number(amount).toLocaleString() : "0"}</>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Stage 3: Success Status */}
        {stage === "status" && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-panel max-w-xl mx-auto p-10 rounded-3xl border-[1.5px] border-[var(--color-border)] shadow-sm flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                damping: 12,
                mass: 0.75,
                stiffness: 200,
                delay: 0.1,
              }}
              className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-500/10"
            >
              <CheckCircle2 size={40} className="stroke-[3]" />
            </motion.div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-8">
              Your {new URLSearchParams(location.search).get("cat") || "Bill"}{" "}
              payment of{" "}
              <strong className="text-[var(--color-text-primary)]">
                ₦
                {Number(
                  new URLSearchParams(location.search).get("amt") || 0,
                ).toLocaleString()}
              </strong>{" "}
              was successful.
            </p>

            <div className="w-full bg-[var(--color-bg-secondary)] px-4 py-3 rounded-xl font-mono text-xs font-bold text-[var(--color-text-tertiary)] mb-8 border border-[var(--color-border)] flex justify-between items-center">
              <span>Transaction Ref</span>
              <span className="text-[var(--color-text-primary)]">
                {ref || "SIMULATED-TXN"}
              </span>
            </div>

            <button
              onClick={() => navigate("/app/home")}
              className="w-full py-4 bg-brand-primary text-white font-bold text-sm rounded-2xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BillsPage;
