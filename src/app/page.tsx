import ScoreRing from "@/components/ScoreRing";
import CategoryCard from "@/components/CategoryCard";
import LiveFeed from "@/components/LiveFeed";
import BriefCard from "@/components/BriefCard";
import TacticalBoard from "@/components/TacticalBoard";
import Heatmap from "@/components/Heatmap";
import ProgressMetrics from "@/components/ProgressMetrics";
import { mockCategories, mockLiveEvents, mockBrief, getCompositeScore } from "@/lib/mock-data";

export default function Home() {
  const compositeScore = getCompositeScore(mockCategories);

  return (
    <div className="min-h-screen bg-[#070d18] pitch-grid relative z-10 pb-6">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-6 w-[52px] bg-[#050a14] border-r border-[#1e293b] z-50 flex flex-col items-center py-4">
        <div className="w-7 h-7 rounded-[2px] bg-[#d4af37] flex items-center justify-center mb-6">
          <span className="text-[#050a14] font-heading text-[10px]">S</span>
        </div>

        <nav className="flex flex-col items-center gap-1 flex-1">
          {[
            { icon: "◉", active: true, label: "DASHBOARD" },
            { icon: "◈", active: false, label: "BRIEFS" },
            { icon: "⚡", active: false, label: "ALERTS" },
            { icon: "◎", active: false, label: "DATA" },
            { icon: "⚙", active: false, label: "SETTINGS" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-10 h-10 flex items-center justify-center rounded-[2px] text-sm transition-all ${
                item.active
                  ? "bg-[#1a2a4a] border-l-[3px] border-l-[#d4af37] text-[#d4af37]"
                  : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#0c1425]"
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="w-8 h-8 rounded-[2px] bg-[#1a2a4a] border border-[#1e293b] flex items-center justify-center">
          <span className="font-data text-[9px] text-[#d4af37] font-bold">K</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-[52px]">
        {/* Control Header */}
        <header className="h-12 bg-[#050a14] border-b border-[#1e293b] flex items-center justify-between px-5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="font-heading text-[9px] tracking-[0.15em] text-[#64748b]">HOME</span>
            <span className="text-[#1e293b]">/</span>
            <span className="font-heading text-[9px] tracking-[0.15em] text-[#d4af37]">DASHBOARD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#111d35] border border-[#1e293b] rounded-[2px] px-3 py-1.5 w-48 flex items-center gap-2">
              <span className="text-[#64748b] text-[10px]">⌕</span>
              <span className="font-ui text-[9px] text-[#475569]">SEARCH TOKENS...</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e] status-live" />
              <span className="font-data text-[8px] font-bold text-[#22c55e]">ONLINE</span>
              <span className="font-data text-[8px] text-[#475569] ml-1">12MS</span>
            </div>
            <button className="btn-gold px-4 py-1.5 text-[9px] flex items-center gap-1.5">
              <span>▶</span> SUBSCRIBE
            </button>
          </div>
        </header>

        {/* Context Banner */}
        <section className="h-24 bg-gradient-to-r from-[#070d18] via-[#0f1a30] to-[#1a2a4a] border-b border-[#1e293b] px-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#d4af3710] to-transparent" />
          <div className="flex items-center gap-5 relative z-10">
            <ScoreRing score={compositeScore} size={72} strokeWidth={3} change={4} />
            <div>
              <h1 className="font-heading text-[20px] tracking-tight text-white leading-none mb-1">THE SIGNAL</h1>
              <p className="font-ui text-[9px] text-[#64748b] uppercase tracking-wider">COMPOSITE MARKET INTELLIGENCE · UPDATED 3-5× DAILY</p>
            </div>
          </div>
          <div className="flex items-center gap-0 relative z-10 self-end">
            {["OVERVIEW", "ANALYSIS", "HISTORY", "SETTINGS"].map((tab, i) => (
              <button key={tab} className={`px-4 py-2.5 font-heading text-[9px] tracking-[0.12em] transition-all ${
                i === 0 ? "tab-active text-[#d4af37]" : "text-[#475569] hover:text-[#94a3b8] border-b-2 border-transparent"
              }`}>{tab}</button>
            ))}
          </div>
        </section>

        <main className="px-5 py-5">
          {/* Category score pills */}
          <div className="flex items-center gap-2 mb-5">
            {mockCategories.map((cat) => {
              const color = cat.score >= 70 ? "#d4af37" : cat.score >= 50 ? "#06b6d4" : "#ef4444";
              return (
                <div key={cat.name} className="card px-3 py-2 flex items-center gap-2">
                  <span className="text-xs">{cat.emoji}</span>
                  <span className="font-heading text-[7px] tracking-[0.12em] text-[#64748b]">{cat.name.toUpperCase()}</span>
                  <span className="font-data text-[11px] font-bold" style={{ color }}>{cat.score}</span>
                  <span className={`font-data text-[7px] font-bold ${cat.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {cat.change >= 0 ? "▲" : "▼"}{Math.abs(cat.change)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Brief */}
          <div className="mb-5">
            <BriefCard brief={mockBrief} />
          </div>

          {/* Main 12-col grid: Tactical (4) + Data (5) + Standings (3) */}
          <div className="grid grid-cols-12 gap-4 mb-5">
            {/* Left column — Tactical Analysis */}
            <div className="col-span-4 space-y-4">
              <TacticalBoard />
              <LiveFeed events={mockLiveEvents.slice(0, 5)} />
            </div>

            {/* Center column — Data Hub */}
            <div className="col-span-5 space-y-4">
              {/* Top row: 2 category cards */}
              <div className="grid grid-cols-2 gap-4">
                <CategoryCard category={mockCategories[0]} />
                <CategoryCard category={mockCategories[1]} />
              </div>
              {/* Heatmap */}
              <Heatmap />
              {/* Bottom row: 2 category cards */}
              <div className="grid grid-cols-2 gap-4">
                <CategoryCard category={mockCategories[2]} />
                <CategoryCard category={mockCategories[3]} />
              </div>
            </div>

            {/* Right column — Standings/Metrics */}
            <div className="col-span-3 space-y-4">
              <ProgressMetrics />
              <CategoryCard category={mockCategories[4]} />
              <CategoryCard category={mockCategories[5]} />

              {/* Tactical Insights ticker */}
              <div className="card p-4">
                <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1] mb-3">TACTICAL INSIGHTS</h3>
                <div className="space-y-2">
                  {[
                    { color: "border-l-[#d4af37]", text: "WHALE ACCUMULATION AT 2-WEEK HIGH — EXCHANGE OUTFLOWS ACCELERATING" },
                    { color: "border-l-[#22c55e]", text: "PUMP.FUN GRADUATION RATE 1.8% — DEGEN SENTIMENT RETURNING" },
                    { color: "border-l-[#ef4444]", text: "BTC FUNDING RATE ELEVATED — OVERLEVERAGED LONGS AT RISK" },
                    { color: "border-l-[#06b6d4]", text: "FRESH $240M USDC MINTED — NEW CAPITAL ENTERING SYSTEM" },
                  ].map((item, i) => (
                    <div key={i} className={`border-l-2 ${item.color} bg-[#050a14] pl-3 py-2 rounded-[1px]`}>
                      <span className="font-data text-[8px] text-[#94a3b8] leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* System Footer Bar — fixed 24px gold bar */}
      <div className="fixed bottom-0 left-0 right-0 h-6 system-bar flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="#050a14" strokeWidth="1.5"/><path d="M7 4v3l2 1" stroke="#050a14" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>{new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="2" height="6" fill="#050a14"/><rect x="6" y="3" width="2" height="9" fill="#050a14"/><rect x="10" y="1" width="2" height="11" fill="#050a14"/></svg>
            <span>SERVER LOAD: 23%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1" stroke="#050a14" strokeWidth="1.5"/><line x1="1" y1="6" x2="13" y2="6" stroke="#050a14" strokeWidth="1"/></svg>
            <span>DB V2.4.1</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span>API CALLS: 2,847 / 5,000</span>
          <span>LATENCY: 12MS</span>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" fill="#050a14"/><circle cx="7" cy="7" r="5.5" stroke="#050a14" strokeWidth="1"/></svg>
            <span>V0.1.0-MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
