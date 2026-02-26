"use client";

interface ProgressListProps {
  items: { name: string; score: number }[];
}

const colors: Record<string, string> = {
  "Market Sentiment": "#fbbf24",
  "Onchain Activity": "#34d399",
  "DeFi Yields": "#fb923c",
  "Macro Pulse": "#22d3ee",
  "Stablecoins": "#a78bfa",
  "Smart Money": "#4f6ef7",
  "DegenFi": "#a78bfa",
};

export default function ProgressList({ items }: ProgressListProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14px] font-semibold text-white">Category rankings</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[item.name] || "#4f6ef7" }} />
                <span className="text-[12px] text-[#a0a3b1]">{item.name}</span>
              </div>
              <span className="text-[12px] text-white font-semibold">{item.score}/100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${item.score}%`, background: colors[item.name] || "#4f6ef7" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
