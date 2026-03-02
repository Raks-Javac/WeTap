import { motion } from "framer-motion";

const NFCAnimation = () => {
  return (
    <section className="py-16 px-6 flex justify-center items-center">
      <div className="glass-panel relative w-64 h-64 md:w-80 md:h-80 rounded-full flex justify-center items-center">
        {/* Ripple 1 */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-2 border-brand-primary"
        />
        {/* Ripple 2 */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-[10%] rounded-full border-2 border-brand-accent"
        />

        <div className="z-10 text-center flex flex-col items-center">
          <div className="text-5xl mb-2">📱</div>
          <p className="font-semibold text-[var(--color-text-primary)]">
            Hold Near Reader
          </p>
        </div>
      </div>
    </section>
  );
};

export default NFCAnimation;
