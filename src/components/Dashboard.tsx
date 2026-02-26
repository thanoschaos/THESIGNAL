"use client";

import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import ScoreChart from "@/components/ScoreChart";
import DonutChart from "@/components/DonutChart";
import ProgressList from "@/components/ProgressList";
import InsightsFeed from "@/components/InsightsFeed";
import YieldsTable from "@/components/YieldsTable";

interface DashboardProps {
  rawData: {
    fearGreed: { value: number; label: string; history: { value: number; date: string }[] } | null;
    globalMarket: { totalMarketCap: number; totalVolume24h: number; btcDominance: number; ethDominance: number; activeCryptos: number; marketCapChange24h: number } | null;
    dexVolumes: { total24h: number; change24h: number; change7d: number; topChains: { name: string; volume: number }[] } | null;
    tvlData: { totalTvl: number; change7d: number; history: { date: string; tvl: number }[] } | null;
    topYields: { stableYields: { project: string; symbol: string; chain: string; apy: number; tvl: number }[]; volatileYields: { project: string; symbol: string; chain: string; apy: number; tvl: number }[] } | null;
    stablecoins: { totalCirculating: number; change24h: number; top5: { name: string; symbol: string; circulating: number; change24h: number }[] } | null;
    trending: { address: string; chain: string }[] | null;
  };
  scores: Record<string, { score: number; metrics: { label: string; value: string; change?: number; signal: string }[] }>;
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function Dashboard({ rawData, scores }: DashboardProps) {
  // Build metric cards from real data
  const metricCards = [
    {
      name: "Market Sentiment",
      emoji: "🌡️",
      score: scores["Market Sentiment"]?.score ?? 50,
      change: 0,
      color: "#fbbf24",
      value: rawData.fearGreed ? `${rawData.fearGreed.value}` : "—",
      subtitle: rawData.fearGreed?.label ?? "Loading",
      sparkline: rawData.fearGreed?.history.map((h) => h.value) ?? [],
    },
    {
      name: "DEX Volume",
      emoji: "📊",
      score: scores["Onchain Activity"]?.score ?? 50,
      change: rawData.dexVolumes?.change24h ?? 0,
      color: "#34d399",
      value: rawData.dexVolumes ? fmt(rawData.dexVolumes.total24h) : "—",
      subtitle: `${(rawData.dexVolumes?.change7d ?? 0) > 0 ? "+" : ""}${(rawData.dexVolumes?.change7d ?? 0).toFixed(1)}% 7d`,
      sparkline: [],
    },
    {
      name: "Total TVL",
      emoji: "🔒",
      score: scores["DeFi Yields"]?.score ?? 50,
      change: rawData.tvlData?.change7d ?? 0,
      color: "#4f6ef7",
      value: rawData.tvlData ? fmt(rawData.tvlData.totalTvl) : "—",
      subtitle: `${(rawData.tvlData?.change7d ?? 0) > 0 ? "+" : ""}${(rawData.tvlData?.change7d ?? 0).toFixed(1)}% 7d`,
      sparkline: rawData.tvlData?.history.slice(-8).map((h) => h.tvl / 1e9) ?? [],
    },
  ];

  // Composite score
  const allScores = Object.values(scores).map((s) => s.score);
  const compositeScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 50;

  // Progress list items from scores
  const progressItems = Object.entries(scores)
    .map(([name, data]) => ({ name, score: data.score }))
    .sort((a, b) => b.score - a.score);

  // Category distribution for donut
  const catDistribution = Object.entries(scores).map(([name, data]) => ({
    name: name.length > 12 ? name.slice(0, 12) + "…" : name,
    value: data.score,
    color: {
      "Market Sentiment": "#fbbf24",
      "Onchain Activity": "#34d399",
      "DeFi Yields": "#fb923c",
      "Macro Pulse": "#22d3ee",
      "Stablecoins": "#a78bfa",
    }[name] || "#4f6ef7",
  }));

  // Build insights from real metrics
  const insights = Object.entries(scores).flatMap(([category, data]) =>
    data.metrics.slice(0, 1).map((m, i) => ({
      id: `${category}-${i}`,
      timestamp: "Just now",
      type: m.signal as "bullish" | "bearish" | "neutral",
      message: `${m.label}: ${m.value}${m.change !== undefined ? ` (${m.change > 0 ? "+" : ""}${m.change.toFixed(1)}%)` : ""}`,
      category,
    }))
  );

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0a0c10] border-r border-[#23262f] flex flex-col fixed top-0 bottom-0 left-0 z-50">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-[#23262f]">
          <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center">
            <span className="text-white font-bold text-[13px]">📡</span>
          </div>
          <span className="text-[15px] font-bold text-white">The Signal</span>
        </div>

        <div className="px-4 py-3">
          <div className="bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#6b6f7e" strokeWidth="1.5"/><path d="M10 10L13 13" stroke="#6b6f7e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="text-[12px] text-[#6b6f7e]">Search</span>
            <span className="text-[10px] text-[#6b6f7e] ml-auto bg-[#0a0c10] rounded px-1.5 py-0.5">⌘F</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2">
          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2">General</p>
          {[
            { icon: "📊", label: "Dashboard", active: true, href: "/" },
            { icon: "📋", label: "Briefs", active: false, href: "/briefs" },
            { icon: "🔍", label: "Analysis", active: false, href: "#" },
            { icon: "📡", label: "Live Feed", active: false, href: "#" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] transition-all ${
              item.active ? "sidebar-active font-semibold" : "text-[#a0a3b1] hover:bg-[#161921] hover:text-white"
            }`}>
              <span className="text-[14px]">{item.icon}</span>{item.label}
            </Link>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Data</p>
          {[
            { icon: "🐋", label: "Smart Money" },
            { icon: "🎰", label: "DegenFi" },
            { icon: "💰", label: "Yields" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
              <span className="text-[14px]">{item.icon}</span>{item.label}
              <svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 3L7 6L4 9" stroke="#6b6f7e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Support</p>
          {[{ icon: "⚙️", label: "Settings" }, { icon: "❓", label: "Help Center" }].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
              <span className="text-[14px]">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="ml-[220px] flex-1">
        <header className="h-16 border-b border-[#23262f] flex items-center justify-between px-8 sticky top-0 bg-[#0f1117]/80 backdrop-blur-xl z-40">
          <h1 className="text-[20px] font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0 mr-4">
              {["SIGNAL METRICS", "YIELDS", "LIVE FEED"].map((tab, i) => (
                <button key={tab} className={`px-4 py-4 text-[11px] font-semibold tracking-wide transition-all ${
                  i === 0 ? "tab-active" : "text-[#6b6f7e] hover:text-[#a0a3b1] border-b-2 border-transparent"
                }`}>{tab}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[11px] text-[#34d399] font-medium">Live data</span>
            </div>
            <div className="flex items-center gap-2.5 ml-4 pl-4 border-l border-[#23262f]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa] flex items-center justify-center">
                <span className="text-white font-bold text-[12px]">K</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white leading-tight">Koko</p>
                <p className="text-[10px] text-[#6b6f7e]">Pro</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Top: 3 metric cards + progress list */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {metricCards.map((card) => (
              <MetricCard key={card.name} category={{
                name: card.name,
                emoji: card.emoji,
                score: card.score,
                change: Math.round(card.change),
                color: card.color,
                description: card.subtitle,
                sparkline: card.sparkline,
                metrics: scores[card.name === "DEX Volume" ? "Onchain Activity" : card.name === "Total TVL" ? "DeFi Yields" : card.name]?.metrics.map(m => ({
                  ...m,
                  signal: m.signal as "bullish" | "bearish" | "neutral",
                })) ?? [],
              }} bigValue={card.value} />
            ))}
            <ProgressList items={progressItems} />
          </div>

          {/* Middle: Chart + Donut */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-3">
              <ScoreChart scores={scores} />
            </div>
            <DonutChart data={catDistribution} />
          </div>

          {/* Bottom: Yields + Insights */}
          <div className="grid grid-cols-2 gap-4">
            <YieldsTable yields={rawData.topYields} />
            <InsightsFeed events={insights} />
          </div>

          {/* Composite footer */}
          <div className="mt-4 card p-5 flex items-center justify-between">
            <div>
              <span className="text-[12px] text-[#6b6f7e]">COMPOSITE SIGNAL SCORE</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-bold text-white">{compositeScore}</span>
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${compositeScore >= 50 ? "badge-green" : "badge-red"}`}>
                  {compositeScore >= 70 ? "BULLISH" : compositeScore >= 50 ? "NEUTRAL" : compositeScore >= 30 ? "CAUTIOUS" : "BEARISH"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {progressItems.map((item) => (
                <div key={item.name} className="text-center">
                  <p className="text-[10px] text-[#6b6f7e] uppercase">{item.name}</p>
                  <p className="text-[18px] font-bold text-white">{item.score}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
