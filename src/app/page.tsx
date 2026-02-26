import ScoreRing from "@/components/ScoreRing";
import CategoryCard from "@/components/CategoryCard";
import LiveFeed from "@/components/LiveFeed";
import BriefCard from "@/components/BriefCard";
import { mockCategories, mockLiveEvents, mockBrief, getCompositeScore } from "@/lib/mock-data";

export default function Home() {
  const compositeScore = getCompositeScore(mockCategories);

  return (
    <div className="min-h-screen bg-[#070d18] pitch-grid relative z-10">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[52px] bg-[#050a14] border-r border-[#1e293b] z-50 flex flex-col items-center py-4">
        {/* Logo */}
        <div className="w-7 h-7 rounded-[2px] bg-[#d4af37] flex items-center justify-center mb-6">
          <span className="text-[#050a14] font-heading text-[10px]">S</span>
        </div>

        {/* Nav icons */}
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

        {/* User */}
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
            {/* Search */}
            <div className="bg-[#111d35] border border-[#1e293b] rounded-[2px] px-3 py-1.5 w-48 flex items-center gap-2">
              <span className="text-[#64748b] text-[10px]">⌕</span>
              <span className="font-ui text-[9px] text-[#475569]">SEARCH TOKENS...</span>
            </div>

            {/* Status */}
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
          {/* Gold tint overlay on right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#d4af3710] to-transparent" />

          <div className="flex items-center gap-5 relative z-10">
            {/* Score ring */}
            <ScoreRing score={compositeScore} size={72} strokeWidth={3} change={4} />

            <div>
              <h1 className="font-heading text-[20px] tracking-tight text-white leading-none mb-1">
                THE SIGNAL
              </h1>
              <p className="font-ui text-[9px] text-[#64748b] uppercase tracking-wider">
                COMPOSITE MARKET INTELLIGENCE · UPDATED 3-5× DAILY
              </p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-0 relative z-10 self-end">
            {["OVERVIEW", "ANALYSIS", "HISTORY", "SETTINGS"].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2.5 font-heading text-[9px] tracking-[0.12em] transition-all ${
                  i === 0
                    ? "tab-active text-[#d4af37]"
                    : "text-[#475569] hover:text-[#94a3b8] border-b-2 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <main className="px-5 py-5">
          {/* Category score pills row */}
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

          {/* Grid: Categories (9 cols) + Live Feed (3 cols) */}
          <div className="grid grid-cols-12 gap-4">
            {/* Categories — 9 cols, 3x2 grid */}
            <div className="col-span-9 grid grid-cols-3 gap-4">
              {mockCategories.map((cat) => (
                <CategoryCard key={cat.name} category={cat} />
              ))}
            </div>

            {/* Live Feed — 3 cols */}
            <div className="col-span-3">
              <LiveFeed events={mockLiveEvents} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1e293b] px-5 py-3 flex items-center justify-between">
          <span className="font-heading text-[8px] tracking-[0.2em] text-[#334155]">THE SIGNAL · AI MARKET INTELLIGENCE</span>
          <div className="flex items-center gap-4">
            <span className="font-data text-[8px] text-[#334155]">V0.1.0-MVP</span>
            <span className="font-data text-[8px] text-[#334155]">NOT FINANCIAL ADVICE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
