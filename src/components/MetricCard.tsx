"use client";

import { CategoryScore } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function MetricCard({ category }: { category: CategoryScore }) {
  const data = category.sparkline.map((v, i) => ({ v }));
  const isPositive = category.change >= 0;

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-10 flex items-center justify-center" style={{ background: `${category.color}18` }}>
          <span className="text-sm">{category.emoji}</span>
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-white">{category.name}</h3>
          <p className="text-[11px] text-[#6b6f7e]">Last update at {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-[60px] mt-2 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${category.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={category.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={category.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={category.color}
              strokeWidth={2}
              fill={`url(#grad-${category.name})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Score + Change */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">{category.score}</span>
        <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? "badge-green" : "badge-red"}`}>
          {isPositive ? "+" : ""}{category.change}%
        </span>
      </div>
    </div>
  );
}
