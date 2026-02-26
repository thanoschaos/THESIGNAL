"use client";

import { Brief } from "@/lib/analysis";
import Link from "next/link";

const signalColors = {
  bullish: { bg: "bg-[#34d39915]", border: "border-[#34d39930]", text: "text-[#34d399]", dot: "bg-[#34d399]" },
  bearish: { bg: "bg-[#f8717115]", border: "border-[#f8717130]", text: "text-[#f87171]", dot: "bg-[#f87171]" },
  neutral: { bg: "bg-[#fbbf2415]", border: "border-[#fbbf2430]", text: "text-[#fbbf24]", dot: "bg-[#fbbf24]" },
};

const sentimentColors: Record<string, string> = {
  BULLISH: "badge-green",
  NEUTRAL: "bg-[#fbbf2415] text-[#fbbf24]",
  CAUTIOUS: "bg-[#fb923c15] text-[#fb923c]",
  BEARISH: "badge-red",
};

export default function BriefsPage({ brief }: { brief: Brief }) {
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

        <nav className="flex-1 px-3 py-4">
          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2">General</p>
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">📊</span>Dashboard
          </Link>
          <Link href="/briefs" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] sidebar-active font-semibold">
            <span className="text-[14px]">📋</span>Briefs
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">🔍</span>Analysis
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">📡</span>Live Feed
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="ml-[220px] flex-1">
        <header className="h-16 border-b border-[#23262f] flex items-center justify-between px-8 sticky top-0 bg-[#0f1117]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#6b6f7e] hover:text-white transition-colors text-[13px]">← Dashboard</Link>
            <h1 className="text-[20px] font-bold text-white">Signal Brief</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[11px] text-[#34d399] font-medium">Live data</span>
            </div>
            <span className="text-[12px] text-[#6b6f7e]">{brief.timestamp}</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-8 py-8">
          {/* Hero */}
          <div className="card p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${sentimentColors[brief.sentiment]}`}>
                    {brief.sentiment}
                  </span>
                  <span className="text-[12px] text-[#6b6f7e]">Composite Score</span>
                </div>
                <h2 className="text-[28px] font-bold text-white leading-tight mb-4">{brief.headline}</h2>
                <p className="text-[14px] text-[#a0a3b1] leading-relaxed">{brief.tldr}</p>
              </div>
              <div className="ml-8 flex flex-col items-center">
                <span className="text-6xl font-bold text-white">{brief.compositeScore}</span>
                <span className="text-[11px] text-[#6b6f7e] mt-1">/100</span>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="card p-6 mb-6">
            <h3 className="text-[15px] font-semibold text-white mb-4">Key Takeaways</h3>
            <div className="space-y-2">
              {brief.keyTakeaways.map((t, i) => (
                <div key={i} className="bg-[#161921] rounded-xl px-4 py-3 text-[13px] text-[#a0a3b1] leading-relaxed">
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="space-y-4 mb-6">
            {brief.sections.map((section) => {
              const colors = signalColors[section.signal];
              return (
                <div key={section.title} className="card p-6">
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.emoji}</span>
                      <h3 className="text-[15px] font-semibold text-white">{section.title}</h3>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {section.signal}
                    </span>
                  </div>

                  {/* Analysis text */}
                  <p className="text-[13px] text-[#a0a3b1] leading-[1.8] mb-5">{section.analysis}</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {section.keyMetrics.map((m, i) => {
                      const mColors = signalColors[m.signal];
                      return (
                        <div key={i} className="bg-[#0a0c10] rounded-xl p-3.5">
                          <p className="text-[10px] text-[#6b6f7e] uppercase tracking-wider mb-1.5 font-medium">{m.label}</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${mColors.dot}`} />
                            <span className="text-[14px] text-white font-semibold">{m.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Factors */}
          <div className="card p-6 mb-6">
            <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
              ⚠️ Risk Factors
            </h3>
            <div className="space-y-2">
              {brief.riskFactors.map((r, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px] text-[#a0a3b1] leading-relaxed">
                  <span className="text-[#f87171] mt-0.5">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center py-6 border-t border-[#23262f]">
            <p className="text-[11px] text-[#6b6f7e]">
              THE SIGNAL — AI-powered market intelligence. This is not financial advice. Always do your own research.
            </p>
            <p className="text-[10px] text-[#6b6f7e] mt-1">
              Data sources: CoinGecko, DeFi Llama, Alternative.me · Updated every 5 minutes
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
