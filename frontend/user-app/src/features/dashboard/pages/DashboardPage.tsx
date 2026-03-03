import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../../core/api";
import EmptyState from "../../../components/state/EmptyState";
import ErrorState from "../../../components/state/ErrorState";
import LoadingState from "../../../components/state/LoadingState";

const mockGraphData = [
  { day: "Mon", amount: 12500 },
  { day: "Tue", amount: 18200 },
  { day: "Wed", amount: 15400 },
  { day: "Thu", amount: 28900 },
  { day: "Fri", amount: 21000 },
  { day: "Sat", amount: 35000 },
  { day: "Sun", amount: 24500 },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.users.dashboard,
  });
  const transactions = (dashboard?.recent_transactions || []).map((tx: any) => ({
    id: tx.reference || tx.id,
    name: tx.merchant || tx.counterparty || "WeTap",
    type: tx.type || "Transaction",
    date: tx.created_at || tx.timestamp,
    amount: Number(tx.direction === "credit" ? tx.amount : -tx.amount),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto"
    >
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Overview
        </h1>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
          Your balance and recent activity, simplified.
        </p>
      </motion.header>

      {/* Complete Profile Reminder */}
      <motion.div variants={itemVariants}>
        <div className="p-5 border border-brand-primary/20 bg-brand-primary/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] tracking-tight">
              Complete Your Profile
            </h3>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">
              Secure your account and unlock higher transfer limits today.
            </p>
          </div>
          <button
            onClick={() => navigate("/app/settings")}
            className="shrink-0 px-5 py-2 text-sm bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            Complete KYC
          </button>
        </div>
      </motion.div>

      {/* Main Grid Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Balance & Graph */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Balance Card */}
          <motion.div
            variants={itemVariants}
            className="relative p-6 sm:p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Wallet size={14} /> Total Available Balance
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  <span className="text-white/60 text-2xl mr-1">₦</span>
                  {Number(dashboard?.wallet?.balance || 0).toLocaleString()}
                  <span className="text-white/60 text-2xl">.00</span>
                </h2>
              </div>
            </div>

            <div className="relative z-10 flex gap-3">
              <button
                onClick={() => navigate("/app/transfers/new")}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-900 transition-colors py-3.5 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 active:scale-95 shadow-sm"
              >
                <ArrowUpRight size={18} strokeWidth={2.5} /> Send
              </button>
              <button
                onClick={() => navigate("/app/add-money")}
                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors py-3.5 rounded-2xl font-bold text-sm text-white flex justify-center items-center gap-2 active:scale-95 shadow-sm border border-white/10"
              >
                <ArrowDownLeft size={18} strokeWidth={2.5} /> Add Money
              </button>
            </div>
          </motion.div>

          {/* Spend Analytics Graph */}
          <motion.div
            variants={itemVariants}
            className="glass-panel p-6 rounded-3xl border border-[var(--color-border)] shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-primary" /> Spend
                  History
                </h3>
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Past 7 days
                </p>
              </div>
              <h4 className="text-xl font-extrabold">₦155,000</h4>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockGraphData}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ fontWeight: 600, color: "#1e293b" }}
                    cursor={{
                      stroke: "#3b82f6",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    animationDuration={1500}
                    animationEasing="ease"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Mini Actions & History */}
        <div className="space-y-6 flex flex-col">
          {/* Quick NFC Pay */}
          <motion.button
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              backgroundColor: "var(--color-bg-secondary)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/app/tap")}
            className="w-full glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center border-2 border-transparent hover:border-brand-primary/30 transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary shadow-inner">
              <CreditCard size={28} />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1">WeTap Pay</h3>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] px-2">
              Hold near any NFC terminal to instantly complete a payment.
            </p>
          </motion.button>

          {/* Recent Activity List */}
          <motion.div
            variants={itemVariants}
            className="glass-panel p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex-1 flex flex-col"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold tracking-tight">Recent Activity</h3>
              <button
                onClick={() => navigate("/app/history")}
                className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover flex items-center transition-colors"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-1 relative flex-1 min-h-[200px]">
              {isLoading ? (
                <LoadingState label="Loading activity..." />
              ) : isError ? (
                <ErrorState message="Could not load recent activity." onRetry={() => refetch()} />
              ) : transactions.length === 0 ? (
                <EmptyState title="No transactions yet" message="Your latest activity will appear here." />
              ) : (
                transactions.slice(0, 4).map((tx: any, idx: number) => (
                  <div
                    key={tx.id || idx}
                    onClick={() => navigate(`/app/history/${tx.id}`)}
                    className="flex justify-between items-center p-3 -mx-3 hover:bg-[var(--color-bg-secondary)] rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm shadow-inner hidden sm:flex">
                        {tx.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">
                          {tx.name}
                        </p>
                        <p className="text-[10px] font-medium text-[var(--color-text-secondary)] mt-0.5">
                          {tx.type} •{" "}
                          {new Date(tx.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-sm tracking-tight ${tx.amount > 0 ? "text-emerald-500" : "text-[var(--color-text-primary)]"}`}
                    >
                      {tx.amount > 0 ? "+" : ""}₦
                      {Math.abs(tx.amount).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default DashboardPage;
