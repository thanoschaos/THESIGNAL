"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function DonutChart({ data }: DonutChartProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">Score distribution</h3>
          <p className="text-[11px] text-[#6b6f7e] mt-0.5">By category weight</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[140px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-[12px] text-[#a0a3b1] flex-1">{item.name}</span>
              <span className="text-[12px] text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
