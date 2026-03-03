import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="glass-panel p-8 rounded-2xl text-center border border-[var(--color-border)]">
      <Inbox className="mx-auto mb-3 text-[var(--color-text-tertiary)]" size={28} />
      <h3 className="font-bold text-[var(--color-text-primary)]">{title}</h3>
      {message ? <p className="text-sm mt-1 text-[var(--color-text-secondary)]">{message}</p> : null}
    </div>
  );
}
