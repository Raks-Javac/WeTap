import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  EyeOff,
  Loader2,
  Settings,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../core/api";

const CardsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: api.cards.list,
  });

  const issueMutation = useMutation({
    mutationFn: api.cards.tokenize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const freezeMutation = useMutation({
    mutationFn: ({ id, isFrozen }: { id: string; isFrozen: boolean }) =>
      api.cards.toggleFreeze(id, isFrozen),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const activeCard =
    cards?.find((c: any) => c.status === "ACTIVE") || cards?.[0];

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
      className="space-y-6 max-w-5xl mx-auto"
    >
      <motion.header
        variants={itemVariants}
        className="flex justify-between items-end mb-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            My Cards
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
            Manage your secure physical and virtual tokens.
          </p>
        </div>
        <button
          onClick={() => issueMutation.mutate()}
          disabled={issueMutation.isPending}
          className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 text-sm"
        >
          {issueMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="text-xl leading-none mr-1">+</span>
          )}
          Issue Card
        </button>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Card Visualizer */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group border border-[var(--color-border)] shadow-sm"
        >
          {/* Holographic background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/10 via-brand-primary/10 to-emerald-500/10 mix-blend-overlay opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

          {activeCard ? (
            <motion.div
              key={activeCard.id}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
              className="relative z-10 w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 flex flex-col justify-between shadow-2xl"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <div className="flex justify-between items-start text-white">
                <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                  {activeCard.brand}
                </span>
                <WifiIcon />
              </div>

              <div className="mt-auto">
                <p className="font-mono text-xl sm:text-2xl tracking-widest text-gray-200 mb-4 drop-shadow-md">
                  •••• •••• •••• {activeCard.last4}
                </p>
                <div className="flex justify-between items-end text-sm text-gray-400">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5">
                      Card Holder
                    </p>
                    <p className="font-bold text-gray-100 tracking-tight">
                      JOHN DOE
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5">
                      Expires
                    </p>
                    <p className="font-bold text-gray-100 tracking-tight">
                      {activeCard.expMs}/{activeCard.expYr}
                    </p>
                  </div>
                  <div className="text-right flex items-center h-full">
                    <div className="w-8 h-5 bg-red-500/90 rounded-full inline-block mr-[-12px] mix-blend-screen" />
                    <div className="w-8 h-5 bg-yellow-500/90 rounded-full inline-block mix-blend-screen" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="relative z-10 w-full aspect-[1.586/1] rounded-2xl bg-[var(--color-bg-secondary)] border-2 border-dashed border-[var(--color-border)] p-6 flex flex-col justify-center items-center shadow-inner text-[var(--color-text-secondary)] transition-colors hover:border-brand-primary/50">
              <ShieldCheck
                size={40}
                className="mb-3 text-brand-primary opacity-50"
              />
              <p className="font-bold tracking-tight">No Active Cards Found</p>
              <p className="text-xs font-medium mt-1">
                Issue a new card to get started.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-around px-2 relative z-10">
            <ActionButton
              icon={<EyeOff size={18} />}
              label="Details"
              onClick={() => navigate(`/app/cards/${activeCard?.id || ""}`)}
            />
            <ActionButton
              icon={
                freezeMutation.isPending && activeCard ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Snowflake size={18} />
                )
              }
              label={activeCard?.status === "FROZEN" ? "Unfreeze" : "Freeze"}
              onClick={() =>
                activeCard &&
                freezeMutation.mutate({
                  id: activeCard.id,
                  isFrozen: activeCard.status !== "FROZEN",
                })
              }
            />
            <ActionButton icon={<Settings size={18} />} label="Settings" />
          </div>
        </motion.div>

        {/* List of cards */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="font-bold tracking-tight mb-2">Saved Cards</h3>

          {isLoading ? (
            <div className="p-8 flex justify-center text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-3xl">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : (
            <div className="space-y-3">
              {cards?.map((card: any) => (
                <div
                  key={card.id}
                  className={`glass-panel p-4 flex justify-between items-center transition-all rounded-2xl cursor-pointer hover:border-brand-primary/50 shadow-sm ${card.status === "FROZEN" ? "opacity-60 grayscale-[0.5]" : "border-[var(--color-border)]"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-9 rounded-lg flex items-center justify-center border shadow-inner ${card.type === "VIRTUAL" ? "bg-gray-900 border-gray-700" : "bg-blue-900 border-blue-700"}`}
                    >
                      {card.type === "VIRTUAL" ? (
                        <div className="flex items-center">
                          <div className="w-3.5 h-3.5 bg-red-500 rounded-full mix-blend-screen -mr-1.5" />
                          <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full mix-blend-screen" />
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-white uppercase tracking-wider">
                          {card.brand}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">
                        {card.type === "VIRTUAL"
                          ? "Virtual Debit Card"
                          : "Physical Card"}
                      </p>
                      <p className="text-[11px] font-medium text-[var(--color-text-secondary)] mt-0.5 tracking-wide">
                        •••• {card.last4} • {card.brand}
                      </p>
                    </div>
                  </div>
                  {card.status === "FROZEN" ? (
                    <span className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-[10px] uppercase font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <Snowflake size={10} /> Frozen
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex gap-2 items-center mb-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              <h4 className="font-bold text-sm tracking-tight text-emerald-700 dark:text-emerald-400">
                Tokenization Engine Live
              </h4>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] leading-relaxed">
              Your physical card numbers are never shared with merchants. We use
              PCI-DSS compliant dynamic tokens for every single tap.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-primary)] group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
      {label}
    </span>
  </button>
);

const WifiIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-50 rotate-90"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

export default CardsPage;
