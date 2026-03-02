
const SecurityPositioning = () => {
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-secondary)] mt-12 border-y border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-brand-secondary">
          Enterprise-Grade Security
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
          Built with strict OWASP compliance, rigorous request sanitization, and
          processor-agnostic architecture. Every transaction is encrypted
          utilizing tokenized Interswitch layers.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="p-6 glass-panel flex-1 min-w-[200px]">
            <h4 className="text-white bg-green-500 rounded-full px-4 py-1 inline-block text-xs font-bold uppercase tracking-wide mb-3">
              PCI-DSS Ready
            </h4>
            <p className="font-semibold text-[var(--color-text-primary)]">
              Card Tokenization
            </p>
          </div>
          <div className="p-6 glass-panel flex-1 min-w-[200px]">
            <h4 className="text-white bg-blue-500 rounded-full px-4 py-1 inline-block text-xs font-bold uppercase tracking-wide mb-3">
              OWASP Top 10
            </h4>
            <p className="font-semibold text-[var(--color-text-primary)]">
              Sanitized Pipeline
            </p>
          </div>
          <div className="p-6 glass-panel flex-1 min-w-[200px]">
            <h4 className="text-white bg-purple-500 rounded-full px-4 py-1 inline-block text-xs font-bold uppercase tracking-wide mb-3">
              Zero Trust
            </h4>
            <p className="font-semibold text-[var(--color-text-primary)]">
              Strict Network Rules
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityPositioning;
