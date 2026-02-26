"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Cell } from "recharts";

interface LeverageSectionProps {
  data: {
    score: number;
    bias: string;
    analysis: string;
    fundingSignal: string;
    takerSignal: string;
    metrics: { label: string; value: string; signal: string }[];
    longShortHistory: number[];
    topCoins: { symbol: string; fundingRate: number; openInterest: number }[];
  };
}

const signalColors: Record<string, string> = {
  bullish: "#34d399",
  bearish: "#f87171",
  neutral: "#fbbf24",
};

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function LeverageSection({ data }: LeverageSectionProps) {
  // L/S ratio chart data
  const lsData = data.longShortHistory.map((v, i) => ({
    hour: `${24 - data.longShortHistory.length + i}h`,
    ratio: v,
  }));

  // Funding rate chart for top coins
  const fundingData = [
    { symbol: "BTC", rate: parseFloat(data.metrics.find(m => m.label === "BTC FUNDING RATE")?.value || "0") },
    { symbol: "ETH", rate: parseFloat(data.metrics.find(m => m.label === "ETH FUNDING RATE")?.value || "0") },
    ...data.topCoins.map(c => ({ symbol: c.symbol, rate: c.fundingRate })),
  ];

  const biasColor = data.bias === "LONG HEAVY" ? "#f87171" : data.bias === "SHORT HEAVY" ? "#34d399" : "#fbbf24";

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📐</span>
            <div>
              <h2 className="text-[16px] font-bold text-white">Leverage & Positioning</h2>
              <p className="text-[11px] text-[#6b6f7e]">Derivatives data from OKX · Funding rates, OI, long/short ratios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-[10px] text-[#6b6f7e] uppercase">SCORE</p>
              <p className="text-2xl font-bold" style={{ color: data.score >= 60 ? "#34d399" : data.score >= 40 ? "#fbbf24" : "#f87171" }}>
                {data.score}
              </p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: `${biasColor}15`, color: biasColor, border: `1px solid ${biasColor}30` }}>
              {data.bias}
            </span>
          </div>
        </div>

        <p className="text-[13px] text-[#a0a3b1] leading-[1.8]">{data.analysis}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Metrics grid */}
        <div className="card p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Key Metrics</h3>
          <div className="space-y-3">
            {data.metrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] text-[#6b6f7e]">{m.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: signalColors[m.signal] || "#fbbf24" }} />
                  <span className="text-[12px] text-white font-medium font-mono">{m.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* L/S Ratio chart */}
        <div className="card p-5">
          <h3 className="text-[13px] font-semibold text-white mb-1">Long/Short Ratio (24h)</h3>
          <p className="text-[10px] text-[#6b6f7e] mb-3">{">"} 1.0 = more longs · {"<"} 1.0 = more shorts</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lsData}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#6b6f7e", fontSize: 9 }} interval={3} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: "#6b6f7e", fontSize: 9 }} />
                <Tooltip contentStyle={{ background: "#161921", border: "1px solid #23262f", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="ratio" stroke="#4f6ef7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funding Rates chart */}
        <div className="card p-5">
          <h3 className="text-[13px] font-semibold text-white mb-1">Funding Rates by Token</h3>
          <p className="text-[10px] text-[#6b6f7e] mb-3">Positive = longs pay · Negative = shorts pay</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#6b6f7e", fontSize: 9 }} tickFormatter={(v) => `${v.toFixed(3)}%`} />
                <YAxis type="category" dataKey="symbol" axisLine={false} tickLine={false} tick={{ fill: "#a0a3b1", fontSize: 10, fontWeight: 600 }} width={40} />
                <Tooltip contentStyle={{ background: "#161921", border: "1px solid #23262f", borderRadius: 8, fontSize: 11 }} formatter={(value) => [`${Number(value).toFixed(4)}%`, "Funding"]} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {fundingData.map((entry, i) => (
                    <Cell key={i} fill={entry.rate > 0.02 ? "#f87171" : entry.rate < -0.005 ? "#34d399" : "#4f6ef7"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* OI Table for top coins */}
      <div className="card p-5">
        <h3 className="text-[13px] font-semibold text-white mb-4">Open Interest by Token (OKX)</h3>
        <div className="grid grid-cols-4 gap-3">
          {data.topCoins.filter(c => c.openInterest > 0).map((coin) => (
            <div key={coin.symbol} className="bg-[#0a0c10] rounded-xl p-3.5">
              <p className="text-[11px] text-[#6b6f7e] font-medium mb-1">{coin.symbol}</p>
              <p className="text-[14px] text-white font-semibold">{fmt(coin.openInterest)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
