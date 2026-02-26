"use client";

import MetricCard from "@/components/MetricCard";
import ScoreChart from "@/components/ScoreChart";
import DonutChart from "@/components/DonutChart";
import ProgressList from "@/components/ProgressList";
import InsightsFeed from "@/components/InsightsFeed";
import { mockCategories, mockLiveEvents, getCompositeScore } from "@/lib/mock-data";

export default function Home() {
  const compositeScore = getCompositeScore(mockCategories);

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0a0c10] border-r border-[#23262f] flex flex-col fixed top-0 bottom-0 left-0 z-50">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-[#23262f]">
          <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center">
            <span className="text-white font-bold text-[13px]">📡</span>
          </div>
          <span className="text-[15px] font-bold text-white">The Signal</span>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#6b6f7e" strokeWidth="1.5"/><path d="M10 10L13 13" stroke="#6b6f7e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="text-[12px] text-[#6b6f7e]">Search</span>
            <span className="text-[10px] text-[#6b6f7e] ml-auto bg-[#0a0c10] rounded px-1.5 py-0.5">⌘F</span>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-2">
          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2">General</p>
          {[
            { icon: "📊", label: "Dashboard", active: true },
            { icon: "📋", label: "Briefs", active: false },
            { icon: "🔍", label: "Analysis", active: false },
            { icon: "📡", label: "Live Feed", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] transition-all ${
                item.active
                  ? "sidebar-active font-semibold"
                  : "text-[#a0a3b1] hover:bg-[#161921] hover:text-white"
              }`}
            >
              <span className="text-[14px]">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Data</p>
          {[
            { icon: "🐋", label: "Smart Money" },
            { icon: "🎰", label: "DegenFi" },
            { icon: "💰", label: "Yields" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all"
            >
              <span className="text-[14px]">{item.icon}</span>
              {item.label}
              <svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 3L7 6L4 9" stroke="#6b6f7e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          ))}

          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Support</p>
          {[
            { icon: "⚙️", label: "Settings" },
            { icon: "❓", label: "Help Center" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all"
            >
              <span className="text-[14px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-[220px] flex-1">
        {/* Top header */}
        <header className="h-16 border-b border-[#23262f] flex items-center justify-between px-8 sticky top-0 bg-[#0f1117]/80 backdrop-blur-xl z-40">
          <h1 className="text-[20px] font-bold text-white">Dashboard</h1>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-0 mr-4">
              {["SIGNAL METRICS", "CATEGORY ANALYSIS", "LIVE FEED"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-4 text-[11px] font-semibold tracking-wide transition-all ${
                    i === 0 ? "tab-active" : "text-[#6b6f7e] hover:text-[#a0a3b1] border-b-2 border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date range */}
            <button className="flex items-center gap-2 text-[12px] text-[#a0a3b1] bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 hover:border-[#2a2d38] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5h12M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Feb 21 - Feb 25
            </button>

            <button className="text-[12px] text-[#a0a3b1] bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 hover:border-[#2a2d38] transition-colors">
              Monthly ↓
            </button>

            <button className="text-[12px] text-[#a0a3b1] bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 hover:border-[#2a2d38] transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Filter
            </button>

            <button className="text-[12px] text-[#a0a3b1] bg-[#161921] border border-[#23262f] rounded-lg px-3 py-2 hover:border-[#2a2d38] transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export
            </button>

            {/* Notification + Profile */}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[#23262f]">
              <button className="w-9 h-9 rounded-lg bg-[#161921] border border-[#23262f] flex items-center justify-center text-[#a0a3b1] hover:text-white transition-colors">
                🔔
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa] flex items-center justify-center">
                  <span className="text-white font-bold text-[12px]">K</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white leading-tight">Koko</p>
                  <p className="text-[10px] text-[#6b6f7e]">Pro</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Top metric cards — 3 main + 1 progress list */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <MetricCard category={mockCategories[2]} />
            <MetricCard category={mockCategories[3]} />
            <MetricCard category={mockCategories[1]} />
            <ProgressList />
          </div>

          {/* Middle row: Bar chart + Donut */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-3">
              <ScoreChart />
            </div>
            <DonutChart />
          </div>

          {/* Bottom row: More metric cards + Live insights */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <MetricCard category={mockCategories[0]} />
              <MetricCard category={mockCategories[4]} />
              <MetricCard category={mockCategories[5]} />
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold text-white mb-3">Composite Score</h3>
                <p className="text-[11px] text-[#6b6f7e] mb-4">Overall market intelligence</p>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-5xl font-bold text-white">{compositeScore}</span>
                  <span className="badge-green text-[12px] font-semibold px-2.5 py-1 mb-1.5">+4%</span>
                </div>
                <p className="text-[11px] text-[#6b6f7e] leading-relaxed">
                  Weighted average of 6 categories. Smart Money (25%) is the heaviest signal, followed by Sentiment (20%) and Onchain Activity (18%).
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <InsightsFeed events={mockLiveEvents} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
