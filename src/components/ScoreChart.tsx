"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { monthlyScoreData } from "@/lib/mock-data";

export default function ScoreChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
            <span className="text-[#6b6f7e]">📊</span>
            Average score over time
          </h3>
          <div className="flex items-center gap-4 mt-2">
            {[
              { color: "#4f6ef7", label: "Smart Money" },
              { color: "#34d399", label: "Composite" },
              { color: "#a78bfa", label: "DegenFi" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                <span className="text-[11px] text-[#6b6f7e]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="text-[12px] text-[#a0a3b1] bg-[#1c1f2a] border border-[#23262f] rounded-lg px-3 py-1.5 hover:border-[#2a2d38] transition-colors">
          Monthly ↓
        </button>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyScoreData} barGap={2} barCategoryGap="20%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b6f7e", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b6f7e", fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{ background: "#161921", border: "1px solid #23262f", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#a0a3b1" }}
            />
            <Bar dataKey="smartMoney" fill="#4f6ef7" radius={[3, 3, 0, 0]} />
            <Bar dataKey="composite" fill="#34d399" radius={[3, 3, 0, 0]} />
            <Bar dataKey="degenfi" fill="#a78bfa" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
