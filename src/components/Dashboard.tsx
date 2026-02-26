"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import ScoreChart from "@/components/ScoreChart";
import DonutChart from "@/components/DonutChart";
import ProgressList from "@/components/ProgressList";
import InsightsFeed from "@/components/InsightsFeed";
import YieldsTable from "@/components/YieldsTable";
import LeverageSection from "@/components/LeverageSection";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/Skeleton";

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
  derivatives?: {
    score: number;
    bias: string;
    analysis: string;
    fundingSignal: string;
    takerSignal: string;
    metrics: { label: string; value: string; signal: string }[];
    longShortHistory: number[];
    topCoins: { symbol: string; fundingRate: number; openInterest: number }[];
  } | null;
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function Dashboard({ rawData, scores, derivatives }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated] = useState(new Date());
  
  const smartMoneyRef = useRef<HTMLDivElement>(null);
  const degenfiRef = useRef<HTMLDivElement>(null);
  const yieldsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

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

  // Category distribution for donut - weighted contribution
  const weights = {
    "Market Sentiment": 0.25,
    "Onchain Activity": 0.25,
    "DeFi Yields": 0.20,
    "Macro Pulse": 0.15,
    "Stablecoins": 0.15,
  };
  
  const catDistribution = Object.entries(scores).map(([name, data]) => ({
    name: name.length > 12 ? name.slice(0, 12) + "…" : name,
    value: Math.round((weights[name as keyof typeof weights] || 0.2) * 100),
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

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "BULLISH";
    if (score >= 50) return "NEUTRAL";
    if (score >= 30) return "CAUTIOUS";
    return "BEARISH";
  };

  const sentimentLabel = getSentimentLabel(compositeScore);

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Sidebar overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`w-[220px] bg-[#0a0c10] border-r border-[#23262f] flex flex-col fixed top-0 bottom-0 left-0 z-50 sidebar-mobile ${sidebarOpen ? 'open' : ''} md:translate-x-0`}>
        <div className="px-5 py-5 flex items-center gap-3 border-b border-[#23262f]">
          <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center">
            <span className="text-white font-bold text-[13px]">📡</span>
          </div>
          <span className="text-[15px] font-bold text-white">The Signal</span>
          <button 
            className="ml-auto md:hidden text-[#6b6f7e] hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 hidden md:block">
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
            <Link 
              key={item.label} 
              href={item.href} 
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] transition-all ${
                item.active ? "sidebar-active font-semibold" : "text-[#a0a3b1] hover:bg-[#161921] hover:text-white"
              }`}
            >
              <span className="text-[14px]">{item.icon}</span>{item.label}
            </Link>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Data</p>
          {[
            { icon: "🐋", label: "Smart Money", ref: smartMoneyRef },
            { icon: "🎰", label: "DegenFi", ref: degenfiRef },
            { icon: "💰", label: "Yields", ref: yieldsRef },
          ].map((item) => (
            <button 
              key={item.label} 
              onClick={() => scrollToSection(item.ref)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all"
            >
              <span className="text-[14px]">{item.icon}</span>{item.label}
              <svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 3L7 6L4 9" stroke="#6b6f7e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Support</p>
          {[{ icon: "⚙️", label: "Settings" }, { icon: "❓", label: "Help Center" }].map((item) => (
            <Link 
              key={item.label} 
              href="#"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all"
            >
              <span className="text-[14px]">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="ml-0 md:ml-[220px] flex-1 w-full">
        <header className="h-16 border-b border-[#23262f] flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[#0f1117]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-3">
            <button 
              className="hamburger text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h1 className="text-[20px] font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-0 mr-4">
              {["SIGNAL METRICS", "YIELDS", "LIVE FEED"].map((tab, i) => (
                <button key={tab} className={`px-4 py-4 text-[11px] font-semibold tracking-wide transition-all ${
                  i === 0 ? "tab-active" : "text-[#6b6f7e] hover:text-[#a0a3b1] border-b-2 border-transparent"
                }`}>{tab}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[11px] text-[#34d399] font-medium hidden sm:inline">Live</span>
            </div>
            <div className="hidden md:flex items-center gap-2.5 ml-4 pl-4 border-l border-[#23262f]">
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

        <main className="p-4 md:p-6">
          {/* Data refresh indicator */}
          <div className="mb-4 flex items-center justify-between text-[11px] text-[#6b6f7e]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                <path d="M7 1V3M7 11V13M13 7H11M3 7H1M11.364 11.364L9.95 9.95M4.05 4.05L2.636 2.636M11.364 2.636L9.95 4.05M4.05 9.95L2.636 11.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Data refreshes every 5 min</span>
            </div>
            <span>Last updated {getRelativeTime(lastUpdated)}</span>
          </div>

          {/* Hero: Composite Score */}
          <div className="card p-6 md:p-8 mb-4 hover-lift">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    compositeScore >= 70 ? "badge-green" : 
                    compositeScore >= 50 ? "bg-[#fbbf2415] text-[#fbbf24]" : 
                    compositeScore >= 30 ? "bg-[#fb923c15] text-[#fb923c]" : 
                    "badge-red"
                  }`}>
                    {sentimentLabel}
                  </span>
                  <span className="text-[12px] text-[#6b6f7e]">Composite Signal Score</span>
                </div>
                <h2 className="text-[24px] md:text-[28px] font-bold text-white leading-tight mb-2">
                  {compositeScore >= 70 ? "Strong bullish signals across markets" :
                   compositeScore >= 50 ? "Neutral market conditions with mixed signals" :
                   compositeScore >= 30 ? "Cautious outlook with some headwinds" :
                   "Bearish signals dominating market sentiment"}
                </h2>
                <p className="text-[13px] md:text-[14px] text-[#a0a3b1] leading-relaxed">
                  Aggregated intelligence from {Object.keys(scores).length} signal categories across DeFi, on-chain activity, and market sentiment.
                </p>
              </div>
              <div className="flex flex-col items-center md:ml-8">
                <span className="text-5xl md:text-6xl font-bold text-white animate-number">{compositeScore}</span>
                <span className="text-[11px] text-[#6b6f7e] mt-1">/100</span>
              </div>
            </div>
          </div>

          {/* Top: 3 metric cards + progress list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
          <div ref={smartMoneyRef} className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-3">
              <ScoreChart scores={scores} />
            </div>
            <DonutChart data={catDistribution} />
          </div>

          {/* Leverage & Positioning */}
          {derivatives && (
            <div className="mb-4">
              <LeverageSection data={derivatives} />
            </div>
          )}

          {/* Bottom: Yields + Insights */}
          <div ref={degenfiRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div ref={yieldsRef}>
              <YieldsTable yields={rawData.topYields} />
            </div>
            <InsightsFeed events={insights} />
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-[#23262f]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-6">
                <Link href="/briefs" className="text-[12px] text-[#a0a3b1] hover:text-white transition-colors">
                  Briefs
                </Link>
                <Link href="#" className="text-[12px] text-[#a0a3b1] hover:text-white transition-colors">
                  Documentation
                </Link>
                <Link href="#" className="text-[12px] text-[#a0a3b1] hover:text-white transition-colors">
                  API
                </Link>
                <Link href="#" className="text-[12px] text-[#a0a3b1] hover:text-white transition-colors">
                  Support
                </Link>
              </div>
              <div className="text-[11px] text-[#6b6f7e]">
                v1.0.0 · Built with ❤️ by The Signal Team
              </div>
            </div>
            <div className="text-center text-[11px] text-[#6b6f7e]">
              THE SIGNAL — AI-powered market intelligence. Not financial advice. DYOR.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
