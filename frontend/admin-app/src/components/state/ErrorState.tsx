import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-panel p-6 rounded-2xl text-center border border-red-500/20 bg-red-500/5">
      <AlertTriangle className="mx-auto mb-3 text-red-500" size={28} />
      <h3 className="font-bold text-[var(--color-text-primary)]">{title}</h3>
      {message ? (
        <p className="text-sm mt-1 text-[var(--color-text-secondary)]">{message}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
