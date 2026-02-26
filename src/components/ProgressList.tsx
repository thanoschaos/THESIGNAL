"use client";

interface ProgressItem {
  label: string;
  value: string;
  percent: number;
  color: string;
  date: string;
}

const items: ProgressItem[] = [
  { label: "Smart Money", value: "78", percent: 78, color: "#4f6ef7", date: "Feb 2026" },
  { label: "Onchain Activity", value: "71", percent: 71, color: "#34d399", date: "Feb 2026" },
  { label: "Macro Pulse", value: "69", percent: 69, color: "#22d3ee", date: "Feb 2026" },
  { label: "DeFi Yields", value: "65", percent: 65, color: "#fb923c", date: "Feb 2026" },
  { label: "DegenFi", value: "62", percent: 62, color: "#a78bfa", date: "Feb 2026" },
  { label: "Market Sentiment", value: "58", percent: 58, color: "#fbbf24", date: "Feb 2026" },
];

export default function ProgressList() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14px] font-semibold text-white">Category rankings</h3>
        <button className="text-[#6b6f7e] hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="text-[12px] text-[#a0a3b1]">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-white font-semibold">{item.value} Score</span>
                <span className="text-[11px] text-[#6b6f7e]">{item.date}</span>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${item.percent}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
