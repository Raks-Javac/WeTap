import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingState from "../../../components/state/LoadingState";
import { adminApi } from "../../../services/adminApi";

// Mock Data
type Transaction = {
  id: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  amount: string;
  type: string;
  customer: string;
  timestamp: string;
};

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", {
    header: "TXN ID",
    cell: (info) => (
      <span className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("timestamp", {
    header: "Timestamp",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => (
      <span className="text-sm border border-[var(--color-border)] px-2 py-1 rounded-md bg-[var(--color-bg-secondary)]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => (
      <span className="font-black tracking-tight">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      let colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      if (status === "SUCCESS")
        colorClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      if (status === "FAILED")
        colorClass = "bg-red-500/10 text-red-500 border-red-500/20";

      return (
        <span
          className={`px-2 py-1 text-xs font-bold border rounded uppercase tracking-wider ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  }),
];

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<Transaction | null>(null);
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => adminApi.transactions({ page: 1, limit: 50 }),
  });

  const data: Transaction[] = (response?.data?.items || []).map((item: any) => ({
    id: String(item.reference || item.id || ""),
    status: String(item.status || "PENDING") as Transaction["status"],
    amount: `₦${Number(item.amount || 0).toLocaleString()}.00`,
    type: String(item.type || "Transaction"),
    customer: String(item.user_email || item.customer || item.counterparty || "N/A"),
    timestamp: String(item.created_at || item.timestamp || ""),
  }));

  const filteredData = data.filter((item) => {
    if (!search.trim()) return true;
    const needle = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(needle) ||
      item.customer.toLowerCase().includes(needle) ||
      item.type.toLowerCase().includes(needle) ||
      item.amount.toLowerCase().includes(needle)
    );
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <LoadingState label="Loading transactions..." />;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Live Transactions
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Real-time ledger monitoring across all nodes.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="glass-panel px-4 py-2 font-semibold flex items-center gap-2 text-sm hover:bg-[var(--color-bg-secondary)] transition">
            <Filter size={16} /> Filters
          </button>
          <button className="bg-brand-primary hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Global Search */}
      <div className="glass-panel p-2 flex items-center gap-2 max-w-md">
        <Search size={20} className="text-[var(--color-text-tertiary)] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, Customer, or Amount..."
          className="flex-1 bg-transparent border-none focus:outline-none text-sm p-2 text-[var(--color-text-primary)]"
        />
      </div>

      {/* TanStack Data Table */}
      <div className="glass-panel overflow-hidden border border-[var(--color-border)]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-xs tracking-wider uppercase font-bold text-[var(--color-text-secondary)]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRow(row.original)}
                  className="hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 border-r border-transparent group-hover:border-[var(--color-border)] transition-colors last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="p-8 text-center text-[var(--color-text-secondary)]">
              No transactions found matching criteria.
            </div>
          )}
        </div>
      </div>

      {/* Animated Detail Drawer via Framer Motion */}
      <AnimatePresence>
        {selectedRow && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-96 bg-[var(--color-bg-primary)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col pt-20"
          >
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-secondary)]">
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Transaction Detail
              </h3>
              <button
                onClick={() => setSelectedRow(null)}
                className="p-1 rounded-md hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="text-center pb-6 border-b border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
                  Total Amount
                </p>
                <h2 className="text-4xl font-black tracking-tight mb-3">
                  {selectedRow.amount}
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-bold border rounded uppercase tracking-wider inline-block ${
                    selectedRow.status === "SUCCESS"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : selectedRow.status === "FAILED"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {selectedRow.status}
                </span>
              </div>

              <div className="space-y-4">
                <DetailRow label="Transaction ID" value={selectedRow.id} />
                <DetailRow label="Date & Time" value={selectedRow.timestamp} />
                <DetailRow label="Type" value={selectedRow.type} />
                <DetailRow label="Customer" value={selectedRow.customer} />
              </div>

              <div className="mt-8 bg-[var(--color-bg-tertiary)] rounded-lg p-4 font-mono text-xs text-brand-primary overflow-x-auto">
                <p>{`{`}</p>
                <p className="ml-4">"processor": "interswitch",</p>
                <p className="ml-4">"terminal_id": "203948V1",</p>
                <p className="ml-4">"auth_mode": "PIN_VERIFIED",</p>
                <p className="ml-4">"response_code": "00"</p>
                <p>{`}`}</p>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <button className="w-full py-3 border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg font-bold text-sm transition-colors">
                Download Receipt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for Drawer */}
      <AnimatePresence>
        {selectedRow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRow(null)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
      {label}
    </span>
    <span className="text-sm font-bold text-[var(--color-text-primary)]">
      {value}
    </span>
  </div>
);

export default TransactionsPage;
