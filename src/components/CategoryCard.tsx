"use client";

import { CategoryScore } from "@/lib/mock-data";

function getScoreColor(score: number): string {
  if (score >= 70) return "#00ff88";
  if (score >= 50) return "#ffaa00";
  if (score >= 30) return "#ff8844";
  return "#ff4466";
}

function getSignalDot(signal?: string) {
  if (!signal) return null;
  const colors = { bullish: "#00ff88", bearish: "#ff4466", neutral: "#ffaa00" };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[signal as keyof typeof colors] || "#ffaa00" }}
    />
  );
}

export default function CategoryCard({ category }: { category: CategoryScore }) {
  const color = getScoreColor(category.score);

  return (
    <div className="signal-card rounded-xl bg-[#16161f] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h3 className="font-semibold text-[#e8e8ed]">{category.name}</h3>
            <p className="text-xs text-[#8888a0]">{category.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold" style={{ color }}>{category.score}</span>
          <span className={`text-xs font-medium ${category.change >= 0 ? "text-[#00ff88]" : "text-[#ff4466]"}`}>
            {category.change >= 0 ? "↑" : "↓"} {Math.abs(category.change)}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-1.5 bg-[#2a2a3a] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${category.score}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>

      {/* Metrics */}
      <div className="space-y-2.5">
        {category.metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {getSignalDot(metric.signal)}
              <span className="text-[#8888a0]">{metric.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e8e8ed] font-medium">{metric.value}</span>
              {metric.change !== undefined && (
                <span className={`text-xs ${metric.change >= 0 ? "text-[#00ff88]" : "text-[#ff4466]"}`}>
                  {metric.change >= 0 ? "+" : ""}{metric.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
