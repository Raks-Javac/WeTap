import { motion } from "framer-motion";

const bars = [0, 1, 2];

export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-secondary)]">
      <div className="flex items-end gap-1.5 mb-3" aria-hidden>
        {bars.map((bar) => (
          <motion.span
            key={bar}
            className="w-2.5 rounded-full bg-brand-primary/70"
            animate={{ height: [8, 20, 8] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: bar * 0.1 }}
          />
        ))}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
