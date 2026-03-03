import { motion } from "framer-motion";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    TrendingUp,
    Zap,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import LoadingState from "../../../components/state/LoadingState";
import { adminApi } from "../../../services/adminApi";

const data = [
  { name: "Mon", volume: 4200, count: 240 },
  { name: "Tue", volume: 3800, count: 310 },
  { name: "Wed", volume: 5100, count: 980 },
  { name: "Thu", volume: 4600, count: 560 },
  { name: "Fri", volume: 6200, count: 820 },
  { name: "Sat", volume: 5800, count: 740 },
  { name: "Sun", volume: 7100, count: 930 },
];

const StatCard = ({
  title,
  value,
  trend,
  isPositive,
  secondary,
  icon: Icon,
  delay,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="glass-panel p-6 border-[1.5px] border-[var(--color-border)] hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-[var(--color-bg-secondary)] group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
        <Icon size={20} />
      </div>
      <span
        className={`flex items-center gap-1 text-[13px] font-black px-2 py-1 rounded-lg ${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
      >
        {trend}
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </span>
    </div>

    <h3 className="text-[11px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-1 leading-none">
      {title}
    </h3>
    <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] display-font mb-4">
      {value}
    </h2>

    <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
      <div
        className={`w-1.5 h-1.5 rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"} opacity-50`}
      />
      <p className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
        {secondary}
      </p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.dashboardStats,
  });
  const stats = statsResponse?.data;

  if (isLoading) {
    return <LoadingState label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-brand-primary" />
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
              Live Intelligence Feed
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight display-font">
            System KPIs<span className="text-brand-primary">.</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] font-medium mt-1">
            Global transaction monitoring and network health metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
          <Zap size={14} className="text-amber-500" />
          <span className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
            Nodes Synced: 100%
          </span>
        </div>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gross Volume (24h)"
          value={`₦${Number(stats?.transactions || 0).toLocaleString()}`}
          trend="+18.5%"
          isPositive={true}
          secondary="Performance: Peak"
          icon={Activity}
          delay={0.1}
        />
        <StatCard
          title="Active Endpoints"
          value={Number(stats?.users || 0).toLocaleString()}
          trend="+4.1%"
          isPositive={true}
          secondary="NFC Nodes Active"
          icon={BarChart3}
          delay={0.2}
        />
        <StatCard
          title="Failure Velocity"
          value={`${Math.max(0, Number(stats?.transactions || 0) - Number(stats?.success_transactions || 0))}`}
          trend="-0.01%"
          isPositive={false}
          secondary="Stable Threshold"
          icon={Zap}
          delay={0.3}
        />
        <StatCard
          title="Network Rev"
          value={Number(stats?.cards || 0).toLocaleString()}
          trend="+12.2%"
          isPositive={true}
          secondary="Processing Yield"
          icon={TrendingUp}
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 glass-panel p-8 min-h-[450px] flex flex-col border-[1.5px] border-[var(--color-border)]"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-extrabold text-xl display-font tracking-tight">
                Transaction Pipeline
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] font-bold uppercase tracking-wider mt-1">
                Real-time Volume metrics (Standardized in ₦)
              </p>
            </div>
            <div className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black flex items-center gap-2 border border-brand-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
              LIVE STREAM
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-text-tertiary)"
                  fontSize={10}
                  fontFamily="Inter"
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="var(--color-text-tertiary)"
                  fontSize={10}
                  fontFamily="Inter"
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: "var(--color-border)",
                    borderRadius: "16px",
                    borderWidth: "1.5px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    color: "var(--color-text-primary)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: "Inter",
                  }}
                  labelStyle={{
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-tertiary)",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-8 min-h-[450px] flex flex-col border-[1.5px] border-[var(--color-border)]"
        >
          <div className="mb-8">
            <h3 className="font-extrabold text-xl display-font tracking-tight text-gradient">
              Velocity Analysis
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] font-bold uppercase tracking-wider mt-1">
              Frequency distribution
            </p>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-text-tertiary)"
                  fontSize={10}
                  fontFamily="Inter"
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-bg-secondary)", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: "var(--color-border)",
                    borderRadius: "16px",
                    borderWidth: "1.5px",
                    padding: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#8B5CF6"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">
              <span>Avg Frequency</span>
              <span className="text-[var(--color-text-primary)]">
                ~4,203 ops/min
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
