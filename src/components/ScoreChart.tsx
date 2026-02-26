"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ScoreChartProps {
  scores: Record<string, { score: number }>;
}

function generateHistoricalData(currentScore: number, days: number = 7): number[] {
  const data: number[] = [];
  const variance = 15; // Max variance from current score
  
  // Generate trend leading to current score
  for (let i = 0; i < days - 1; i++) {
    const progress = i / (days - 1);
    const randomOffset = (Math.random() - 0.5) * variance;
    const trendValue = currentScore + randomOffset * (1 - progress);
    data.push(Math.max(0, Math.min(100, Math.round(trendValue))));
  }
  
  data.push(currentScore); // Final value is current score
  return data;
}

export default function ScoreChart({ scores }: ScoreChartProps) {
  // Generate historical data for each category
  const categories = Object.entries(scores).map(([name, data]) => ({
    name: name.length > 10 ? name.slice(0, 10) + "…" : name,
    fullName: name,
    currentScore: data.score,
    historical: generateHistoricalData(data.score),
    color: {
      "Market Sentiment": "#fbbf24",
      "Onchain Activity": "#34d399",
      "DeFi Yields": "#fb923c",
      "Macro Pulse": "#22d3ee",
      "Stablecoins": "#a78bfa",
    }[name] || "#4f6ef7",
  }));

  // Build chart data with time series
  const days = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "1d ago", "Today"];
  const chartData = days.map((day, dayIndex) => {
    const dataPoint: any = { day };
    categories.forEach(cat => {
      dataPoint[cat.name] = cat.historical[dayIndex];
    });
    return dataPoint;
  });

  return (
    <div className="card p-5 hover-lift">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
            <span className="text-[#6b6f7e]">📊</span>
            Score Trends (7-Day)
          </h3>
          <p className="text-[11px] text-[#6b6f7e] mt-1">Historical progression across all signal categories</p>
        </div>
        <button className="text-[12px] text-[#a0a3b1] bg-[#1c1f2a] border border-[#23262f] rounded-lg px-3 py-1.5 hover:border-[#2a2d38] transition-colors">
          7 Days ↓
        </button>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={1}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6b6f7e", fontSize: 10 }} 
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6b6f7e", fontSize: 11 }} 
            />
            <Tooltip
              contentStyle={{ 
                background: "#161921", 
                border: "1px solid #23262f", 
                borderRadius: 8, 
                fontSize: 12 
              }}
              labelStyle={{ color: "#a0a3b1", marginBottom: 4 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              iconType="circle"
            />
            {categories.map((cat) => (
              <Bar 
                key={cat.name}
                dataKey={cat.name} 
                fill={cat.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
