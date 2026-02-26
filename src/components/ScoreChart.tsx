"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ScoreChartProps {
  scores: Record<string, { score: number }>;
}

export default function ScoreChart({ scores }: ScoreChartProps) {
  // Build chart data from real scores
  const categories = Object.entries(scores).map(([name, data]) => ({
    name: name.length > 10 ? name.slice(0, 10) + "…" : name,
    score: data.score,
    fill: {
      "Market Sentiment": "#fbbf24",
      "Onchain Activity": "#34d399",
      "DeFi Yields": "#fb923c",
      "Macro Pulse": "#22d3ee",
      "Stablecoins": "#a78bfa",
    }[name] || "#4f6ef7",
  }));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
            <span className="text-[#6b6f7e]">📊</span>
            Score by category
          </h3>
          <p className="text-[11px] text-[#6b6f7e] mt-1">Current scores across all signal categories</p>
        </div>
        <button className="text-[12px] text-[#a0a3b1] bg-[#1c1f2a] border border-[#23262f] rounded-lg px-3 py-1.5 hover:border-[#2a2d38] transition-colors">
          Current ↓
        </button>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categories} barCategoryGap="25%">
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b6f7e", fontSize: 11 }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#6b6f7e", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#161921", border: "1px solid #23262f", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#a0a3b1" }}
              formatter={(value) => [`${value}`, "Score"]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {categories.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
