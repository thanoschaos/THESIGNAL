"use client";

import { CategoryScore } from "@/lib/mock-data";

function getScoreColor(score: number): string {
  if (score >= 70) return "#d4af37";
  if (score >= 50) return "#06b6d4";
  if (score >= 30) return "#f59e0b";
  return "#ef4444";
}

function getSignalBadge(signal?: string) {
  if (!signal) return null;
  const styles = {
    bullish: "bg-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]",
    bearish: "bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444]",
    neutral: "bg-[#06b6d4]/10 border-[#06b6d4]/40 text-[#06b6d4]",
  };
  const labels = { bullish: "BUY", bearish: "SELL", neutral: "HOLD" };
  return (
    <span className={`${styles[signal as keyof typeof styles]} font-data text-[7px] font-bold tracking-[0.1em] px-1.5 py-0.5 border rounded-[1px]`}>
      {labels[signal as keyof typeof labels]}
    </span>
  );
}

export default function CategoryCard({ category }: { category: CategoryScore }) {
  const color = getScoreColor(category.score);
  const pct = category.score;

  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{category.emoji}</span>
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1]">{category.name.toUpperCase()}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-data text-lg font-bold" style={{ color }}>{category.score}</span>
          <span className={`font-data text-[8px] font-bold ${category.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
            {category.change >= 0 ? "▲" : "▼"}{Math.abs(category.change)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-[3px] bg-[#1e293b] mb-4">
        <div className="h-full progress-gold transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>

      {/* Metrics */}
      <div className="space-y-0">
        {category.metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between row-hover px-2 py-[6px] -mx-2">
            <span className="font-ui text-[9px] text-[#64748b] uppercase tracking-wide">{metric.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-data text-[10px] text-white font-semibold">{metric.value}</span>
              {metric.change !== undefined && (
                <span className={`font-data text-[8px] font-bold ${metric.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {metric.change >= 0 ? "+" : ""}{metric.change}%
                </span>
              )}
              {getSignalBadge(metric.signal)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
