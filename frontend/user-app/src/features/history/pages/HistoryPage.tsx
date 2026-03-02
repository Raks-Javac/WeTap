import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Download,
    FileText,
    Loader2,
    Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../core/api";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { ref } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.transactions.list,
  });

  const selectedTx = transactions?.find((t: any) => t.id === ref);

  const filteredTransactions = transactions?.filter((tx: any) => {
    const matchesSearch = tx.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "All Types" ||
      (filterType === "Credits" && tx.amount > 0) ||
      (filterType === "Debits" && tx.amount < 0);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-[var(--color-text-secondary)]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Transaction History
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Review your recent activity and generate statements.
          </p>
        </div>
        <button className="bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2 rounded-lg font-semibold transition-colors">
          <Download size={18} /> Download Statement
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Timeline View */}
        <div
          className={`glass-panel p-6 flex-1 transition-all ${ref ? "hidden lg:block lg:w-1/2" : "w-full"}`}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:border-brand-primary text-[var(--color-text-primary)]"
            >
              <option>All Types</option>
              <option>Credits</option>
              <option>Debits</option>
            </select>
          </div>

          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--color-border)]">
            {filteredTransactions?.map((tx: any) => (
              <div
                key={tx.id}
                onClick={() => navigate(`/app/history/${tx.id}`)}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-4 cursor-pointer"
              >
                {/* Timeline marker node */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-bg-primary)] ${ref === tx.id ? "bg-brand-primary text-white" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"} group-hover:bg-brand-primary group-hover:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors z-10`}
                >
                  <span className="font-bold text-xs uppercase">
                    {tx.name.charAt(0)}
                  </span>
                </div>

                {/* Content Card */}
                <div
                  className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:bg-[var(--color-bg-secondary)] p-4 rounded-xl transition-colors border ${ref === tx.id ? "border-brand-primary bg-[var(--color-bg-secondary)] shadow-lg shadow-blue-500/10" : "border-transparent hover:border-[var(--color-border)]"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[var(--color-text-primary)] truncate pr-2">
                      {tx.name}
                    </h3>
                    <span
                      className={`font-bold shrink-0 ${tx.amount > 0 ? "text-green-500" : "text-[var(--color-text-primary)]"}`}
                    >
                      {tx.amount > 0 ? "+" : ""}₦
                      {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[var(--color-text-secondary)]">
                    <span className="truncate">{tx.type}</span>
                    <span className="shrink-0">
                      {format(parseISO(tx.date), "MMM d, HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions?.length === 0 && (
              <div className="py-12 text-center text-[var(--color-text-secondary)]">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No transactions found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail View Drawer/Sidebar */}
        <AnimatePresence>
          {ref && selectedTx && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel p-6 lg:p-8 flex-1 sticky top-8 h-fit"
            >
              <button
                onClick={() => navigate("/app/history")}
                className="text-sm font-semibold flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-brand-primary mb-6 transition-colors lg:hidden"
              >
                <ArrowLeft size={16} /> Back to History
              </button>

              <div className="text-center pb-8 border-b border-[var(--color-border)] mb-8">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-primary">
                  {selectedTx.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold mb-1">{selectedTx.name}</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                  {format(parseISO(selectedTx.date), "MMMM do, yyyy • HH:mm a")}
                </p>

                <h3
                  className={`text-4xl font-extrabold tracking-tight ${selectedTx.amount > 0 ? "text-green-500" : "text-[var(--color-text-primary)]"}`}
                >
                  {selectedTx.amount > 0 ? "+" : ""}₦
                  {Math.abs(selectedTx.amount).toLocaleString()}
                </h3>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold mt-4 uppercase">
                  <CheckCircle2 size={14} /> Successful
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between p-3 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <span className="text-[var(--color-text-secondary)]">
                    Reference Number
                  </span>
                  <span className="font-mono text-[var(--color-text-primary)]">
                    {selectedTx.id}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <span className="text-[var(--color-text-secondary)]">
                    Transaction Type
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {selectedTx.type}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <span className="text-[var(--color-text-secondary)]">
                    Payment Method
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    WeTap Balance
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <span className="text-[var(--color-text-secondary)]">
                    Fee
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    ₦0.00
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                <button className="w-full py-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] font-bold rounded-xl transition-colors text-[var(--color-text-primary)]">
                  Report Issue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPage;
