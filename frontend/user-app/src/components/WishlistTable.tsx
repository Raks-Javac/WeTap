import { useGlobalStore } from "../core/store";

const WishlistTable = () => {
  const environment = useGlobalStore((state) => state.environment);

  const roadmap = [
    {
      feature: "NFC One-Tap Integration",
      dev: "Live",
      uat: "Testing",
      prod: "Pending",
    },
    {
      feature: "NFC Two-Tap (PIN)",
      dev: "Live",
      uat: "Testing",
      prod: "Pending",
    },
    {
      feature: "Automated Utility Bills",
      dev: "Live",
      uat: "Pending",
      prod: "Pending",
    },
    { feature: "AI Chat Assistant", dev: "In Design", uat: "N/A", prod: "N/A" },
    {
      feature: "Offline Fallback Tokens",
      dev: "Planned",
      uat: "Planned",
      prod: "Planned",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-[var(--color-text-primary)] text-center">
        Platform Roadmap
      </h2>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] shadow-sm bg-[var(--bg-glass)] backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] uppercase text-xs font-semibold text-[var(--color-text-secondary)]">
              <th className="p-4">Feature</th>
              <th
                className={`p-4 transition-colors ${environment === "dev" ? "text-brand-primary" : ""}`}
              >
                Dev
              </th>
              <th
                className={`p-4 transition-colors ${environment === "uat" ? "text-brand-primary" : ""}`}
              >
                UAT
              </th>
              <th
                className={`p-4 transition-colors ${environment === "prod" ? "text-brand-primary" : ""}`}
              >
                Prod
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {roadmap.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <td className="p-4 font-medium text-[var(--color-text-primary)]">
                  {row.feature}
                </td>
                <td
                  className={`p-4 ${environment === "dev" ? "font-bold text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"}`}
                >
                  {row.dev}
                </td>
                <td
                  className={`p-4 ${environment === "uat" ? "font-bold text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"}`}
                >
                  {row.uat}
                </td>
                <td
                  className={`p-4 ${environment === "prod" ? "font-bold text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"}`}
                >
                  {row.prod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WishlistTable;
