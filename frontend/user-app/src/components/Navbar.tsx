import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "../core/store";

const Navbar = () => {
  const { theme, setTheme } = useGlobalStore();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 transition-all duration-500`}
    >
      <div
        className={`flex justify-between items-center w-full max-w-6xl mx-auto rounded-full transition-all duration-500 ${
          isScrolled
            ? "glass-panel px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--color-border)] bg-[var(--color-bg-primary)]/70 backdrop-blur-2xl dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)]"
            : "px-2 py-4 bg-transparent border-transparent"
        }`}
      >
        <div className="font-extrabold text-2xl text-gradient tracking-tight drop-shadow-sm flex items-center gap-2">
          WeTap.
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-[var(--color-text-secondary)]">
          {["Features", "Security", "How it Works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative hover:text-[var(--color-text-primary)] transition-colors group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full opacity-70"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="text-[15px] font-bold text-[var(--color-text-primary)] hover:text-brand-primary transition-colors hidden md:block px-2"
          >
            Sign In
          </Link>
          <Link
            to="/auth/signup"
            className="text-[14px] font-bold px-6 py-2.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-full shadow-[0_5px_20px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_5px_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center transform-gpu relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
            Get Started
          </Link>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:scale-110 transition-all duration-300 shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
