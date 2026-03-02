import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    Eye,
    EyeOff,
    Loader2,
    Settings,
    ShieldCheck,
    Snowflake,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../core/api";

const CardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNumbers, setShowNumbers] = useState(false);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: api.cards.list,
  });

  const card = cards?.find((c: any) => c.id === id);

  const freezeMutation = useMutation({
    mutationFn: ({ cardId, isFrozen }: { cardId: string; isFrozen: boolean }) =>
      api.cards.toggleFreeze(cardId, isFrozen),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-[var(--color-text-secondary)]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
        <CreditCard size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
          Card Not Found
        </h2>
        <button
          onClick={() => navigate("/app/cards")}
          className="bg-[var(--color-bg-secondary)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--color-bg-tertiary)]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-[var(--color-bg-secondary)] rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Card Details
          </h1>
        </div>
      </header>

      {/* Card Visualizer */}
      <div className="glass-panel p-8 relative overflow-hidden group">
        <div
          className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-700 mix-blend-overlay opacity-50 group-hover:opacity-100 ${card.status === "FROZEN" ? "from-gray-900/40 via-blue-900/40 to-gray-900/40" : "from-brand-primary/40 via-brand-accent/40 to-emerald-900/40"}`}
        />

        <motion.div
          whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
          className={`relative z-10 w-full h-56 rounded-2xl p-6 flex flex-col justify-between shadow-2xl border ${card.status === "FROZEN" ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 opacity-80" : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"}`}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          <div className="flex justify-between items-start text-white">
            <span className="font-extrabold text-xl tracking-tighter uppercase">
              {card.brand}
            </span>
            <WifiIcon />
          </div>

          <div className="mt-8">
            <p className="font-mono text-xl tracking-widest text-gray-300 mb-2 transition-all">
              {showNumbers
                ? `5399 1234 5678 ${card.last4}`
                : `•••• •••• •••• ${card.last4}`}
            </p>
            <div className="flex justify-between items-end text-sm text-gray-400">
              <div>
                <p className="text-xs uppercase mb-1">Card Holder</p>
                <p className="font-semibold text-gray-200">JOHN DOE</p>
              </div>
              <div>
                <p className="text-xs uppercase mb-1">Expires</p>
                <p className="font-semibold text-gray-200">
                  {card.expMs}/{card.expYr}
                </p>
              </div>
              <div className="text-right">
                {showNumbers ? (
                  <div className="flex gap-4 items-center">
                    <div>
                      <p className="text-xs uppercase mb-1">CVV</p>
                      <p className="font-semibold text-gray-200">***</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-6 bg-red-500/80 rounded-full inline-block mr-[-10px] mix-blend-screen" />
                    <div className="w-10 h-6 bg-yellow-500/80 rounded-full inline-block mix-blend-screen" />
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-between px-6 relative z-10 max-w-sm mx-auto">
          <ActionButton
            icon={showNumbers ? <EyeOff size={20} /> : <Eye size={20} />}
            label={showNumbers ? "Hide Info" : "Show Info"}
            onClick={() => setShowNumbers(!showNumbers)}
          />
          <ActionButton
            icon={
              freezeMutation.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Snowflake size={20} />
              )
            }
            label={card.status === "FROZEN" ? "Unfreeze" : "Freeze Card"}
            onClick={() =>
              freezeMutation.mutate({
                cardId: card.id,
                isFrozen: card.status !== "FROZEN",
              })
            }
          />
          <ActionButton
            icon={<Settings size={20} />}
            label="Limits"
            onClick={() => {}}
          />
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <ShieldCheck className="text-green-500" />
          Card Security Settings
        </h3>

        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div>
            <p className="font-semibold">Online Payments</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Allow card to be used online
            </p>
          </div>
          <div className="w-12 h-6 bg-green-500 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div>
            <p className="font-semibold">NFC Tap to Pay</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Allow contactless payments
            </p>
          </div>
          <div
            className={`w-12 h-6 ${card.status === "FROZEN" ? "bg-[var(--color-bg-tertiary)]" : "bg-green-500"} rounded-full relative transition-colors`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${card.status === "FROZEN" ? "left-1" : "right-1"}`}
            />
          </div>
        </div>
      </div>
    </div>
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

export default CardDetailPage;
