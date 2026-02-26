"use client";

interface MetricBar {
  label: string;
  value: number; // 0-100
  displayValue: string;
  color?: "gold" | "green";
}

const metrics: MetricBar[] = [
  { label: "BTC DOMINANCE", value: 52, displayValue: "52.4%", color: "gold" },
  { label: "ETH/BTC RATIO", value: 41, displayValue: "0.041", color: "gold" },
  { label: "DEX VOLUME (24H)", value: 71, displayValue: "$14.2B", color: "green" },
  { label: "FEAR & GREED", value: 62, displayValue: "62 — GREED", color: "gold" },
  { label: "STABLECOIN INFLOW", value: 78, displayValue: "+$240M", color: "green" },
  { label: "FUNDING RATE", value: 35, displayValue: "0.012%", color: "gold" },
];

export default function ProgressMetrics() {
  return (
    <div className="card p-4">
      <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1] mb-4">KEY METRICS</h3>

      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-heading text-[8px] tracking-[0.12em] text-[#64748b]">{m.label}</span>
              <span className="font-data text-[10px] font-bold text-white">{m.displayValue}</span>
            </div>
            <div className="fm-progress">
              <div
                className={`fm-progress-fill ${m.color === "green" ? "fm-progress-green" : "fm-progress-gold"}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
