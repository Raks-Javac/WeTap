import {
    CheckCircle2,
    ChevronRight,
    CreditCard,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminApi } from "../../../services/adminApi";
import { useToast } from "../../../components/toast/ToastProvider";

const CardWizard = () => {
  const [step, setStep] = useState(1);
  const { showToast } = useToast();
  const { data: cardsResponse, refetch } = useQuery({
    queryKey: ["admin-cards"],
    queryFn: () => adminApi.cards(1, 20),
  });
  const cards = cardsResponse?.data?.items || [];

  const blockMutation = useMutation({
    mutationFn: adminApi.blockCard,
    onSuccess: () => {
      showToast("Card blocked", "success");
      refetch();
    },
    onError: (err: any) => {
      showToast(err.message || "Unable to block card", "error");
    },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Issue New Card
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Generate a new PCI-DSS compliant virtual or physical token.
        </p>
      </header>

      {/* Wizard Progress */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--color-bg-secondary)] -z-10 rounded-full">
          <div
            className="h-full bg-brand-primary transition-all duration-500 rounded-full"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-[var(--color-bg-primary)] ${
              step >= i
                ? "bg-brand-primary text-white"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"
            }`}
          >
            {step > i ? <CheckCircle2 size={16} /> : i}
          </div>
        ))}
      </div>

      {/* Step 1: Card Type Selection */}
      {step === 1 && (
        <div className="glass-panel p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold mb-6">Select Card Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-brand-primary bg-brand-primary/5 p-6 rounded-xl cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <CreditCard
                  className="text-brand-primary opacity-20"
                  size={48}
                />
              </div>
              <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
                Virtual Token (VTP)
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Instant issuance for online transactions and NFC mobile
                payments.
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                Existing cards: {cards.length}
              </p>
              <div className="mt-4">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Recommended
                </span>
              </div>
            </div>

            <div className="border-2 border-[var(--color-border)] hover:border-brand-primary/50 p-6 rounded-xl cursor-pointer transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                <CreditCard
                  className="text-[var(--color-text-tertiary)] group-hover:text-brand-primary/20 transition-colors"
                  size={48}
                />
              </div>
              <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
                Physical SmartCard
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Requires shipping address and 3-5 days delivery timeline.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-primary-hover transition"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Customer Binding */}
      {step === 2 && (
        <div className="glass-panel p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold mb-6">
            Customer & Limits Allocation
          </h2>

          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">
                Link to Customer ID
              </label>
              <input
                type="text"
                placeholder="Search by Name or UUID..."
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">
                Daily Transaction Limit (₦)
              </label>
              <select className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:border-brand-primary text-[var(--color-text-primary)]">
                <option>100,000 (Tier 1)</option>
                <option>500,000 (Tier 2)</option>
                <option>Unlimited (Tier 3)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 text-[var(--color-text-secondary)] font-bold hover:text-[var(--color-text-primary)] transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/30 transition"
            >
              Generate Token <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="glass-panel p-12 text-center animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">
            Virtual Card Issued!
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm mx-auto">
            Token has been successfully provisioned to the Interswitch network
            and linked to the customer's mobile app.
          </p>

          <div className="bg-[var(--color-bg-secondary)] py-4 px-8 rounded-xl font-mono text-sm border border-[var(--color-border)] mb-8">
            Token ID: {String(cards[0]?.id || "N/A")}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] px-8 py-3 rounded-lg font-bold transition"
            >
              Issue Another Card
            </button>
            <button
              onClick={() => cards[0]?.id && blockMutation.mutate(String(cards[0].id))}
              disabled={!cards[0]?.id || blockMutation.isPending}
              className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold transition disabled:opacity-50"
            >
              Block Latest Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardWizard;
