import { motion } from "framer-motion";
import { useGlobalStore } from "../core/store";

const EnvSwitcher = () => {
  const { environment, setEnvironment } = useGlobalStore();
  const environments = ["dev", "uat", "staging", "prod"] as const;

  return (
    <div className="glass-panel inline-flex p-1 rounded-full relative gap-1">
      {environments.map((e) => (
        <button
          key={e}
          onClick={() => setEnvironment(e)}
          className={`px-4 py-2 relative rounded-full font-semibold uppercase text-sm z-10 transition-colors ${
            environment === e
              ? "text-white"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          {environment === e && (
            <motion.div
              layoutId="env-active-tab"
              className="absolute inset-0 bg-brand-primary rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {e}
        </button>
      ))}
    </div>
  );
};

export default EnvSwitcher;
