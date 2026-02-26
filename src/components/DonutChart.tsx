"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { categoryDistribution } from "@/lib/mock-data";

export default function DonutChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">Score by category</h3>
          <p className="text-[11px] text-[#6b6f7e] mt-0.5">Last update at {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
        </div>
        <button className="text-[#6b6f7e] hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[140px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {categoryDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-[12px] text-[#a0a3b1] flex-1">{item.name}</span>
              <span className="text-[12px] text-white font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
