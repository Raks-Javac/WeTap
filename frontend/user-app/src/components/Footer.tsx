import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] pt-24 pb-12 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-brand-primary/5 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-8 text-left">
            <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-text-primary)] to-[var(--color-text-secondary)] inline-block">
              WeTap.
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-sm text-lg font-medium leading-relaxed">
              The ultra-futuristic NFC payment experience powered by AI
              assistance and enterprise-grade security.
              <br />
              <br />
              Built for the next generation of finance.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-6 text-lg tracking-tight">
              Product
            </h3>
            <ul className="space-y-4">
              {[
                "Features",
                "Pricing",
                "Security",
                "NFC Technology",
                "Changelog",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[var(--color-text-secondary)] hover:text-brand-primary font-medium transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-6 text-lg tracking-tight">
              Company
            </h3>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Contact", "Partners"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-6 text-lg tracking-tight">
              Legal
            </h3>
            <ul className="space-y-4">
              {[
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Compliance",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA & Copyright */}
        <div className="pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[var(--color-text-tertiary)] text-sm font-medium">
            © {new Date().getFullYear()} WeTap Inc. All rights reserved.{" "}
            <br className="md:hidden" />
            <span className="hidden md:inline"> Designed with precision.</span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/auth/signup" className="flex-1 md:flex-none">
              <button className="w-full md:w-auto px-6 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm">
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
