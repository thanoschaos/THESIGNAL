"use client";

import { CategoryScore } from "@/lib/mock-data";

function getScoreColor(score: number): string {
  if (score >= 70) return "#adff00";
  if (score >= 50) return "#00f2ff";
  if (score >= 30) return "#ff00e5";
  return "#ff0044";
}

function getSignalBadge(signal?: string) {
  if (!signal) return null;
  const cls = signal === "bullish" ? "badge-bullish" : signal === "bearish" ? "badge-bearish" : "badge-neutral";
  return (
    <span className={`${cls} text-[8px] font-tech tracking-[0.15em] px-1.5 py-0.5 rounded-sm`}>
      {signal === "bullish" ? "BUY" : signal === "bearish" ? "SELL" : "HOLD"}
    </span>
  );
}

export default function CategoryCard({ category }: { category: CategoryScore }) {
  const color = getScoreColor(category.score);

  return (
    <div className="glass rounded-lg p-5 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.emoji}</span>
          <div>
            <h3 className="font-tech text-[11px] tracking-[0.2em] text-white/90">{category.name}</h3>
            <p className="text-[10px] text-white/30 mt-0.5 font-mono">{category.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-display font-black" style={{ color }}>{category.score}</span>
          <span className={`font-tech text-[9px] tracking-[0.2em] ${category.change >= 0 ? "text-[#adff00]" : "text-[#ff00e5]"}`}>
            {category.change >= 0 ? "▲" : "▼"} {Math.abs(category.change)}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-[2px] bg-white/5 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full progress-gradient transition-all duration-1000"
          style={{
            width: `${category.score}%`,
            boxShadow: `0 0 12px rgba(0, 242, 255, 0.3)`,
          }}
        />
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {category.metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between row-hover rounded px-2 py-1.5 -mx-2">
            <span className="text-[11px] text-white/40 font-mono">{metric.label}</span>
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] text-white/90 font-mono font-medium">{metric.value}</span>
              {metric.change !== undefined && (
                <span className={`font-tech text-[9px] tracking-wider ${metric.change >= 0 ? "text-[#adff00]" : "text-[#ff00e5]"}`}>
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
