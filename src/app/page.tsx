import ScoreRing from "@/components/ScoreRing";
import CategoryCard from "@/components/CategoryCard";
import LiveFeed from "@/components/LiveFeed";
import BriefCard from "@/components/BriefCard";
import { mockCategories, mockLiveEvents, mockBrief, getCompositeScore } from "@/lib/mock-data";

export default function Home() {
  const compositeScore = getCompositeScore(mockCategories);

  return (
    <div className="min-h-screen bg-[#050505] grid-bg scanline">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[2px] bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] flex items-center justify-center">
              <span className="text-black font-black text-[10px]">S</span>
            </div>
            <span className="font-tech text-[11px] tracking-[0.3em] text-white uppercase">THE SIGNAL</span>
          </div>

          {/* Nav pills */}
          <div className="glass rounded-[4px] px-1 py-1 flex items-center gap-0.5">
            {["DASHBOARD", "BRIEFS", "ALERTS", "SETTINGS"].map((item, i) => (
              <button
                key={item}
                className={`font-tech text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-[2px] transition-all uppercase ${
                  i === 0
                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#adff00] pulse-live" />
              <span className="font-tech text-[9px] tracking-[0.2em] text-[#adff00] uppercase">ONLINE</span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-white/30 ml-1">24MS</span>
            </div>
            <button className="glass rounded-[4px] px-4 py-2 font-tech text-[9px] tracking-[0.2em] text-[#00f2ff] border-[#00f2ff]/30 hover:bg-[#00f2ff]/10 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all uppercase">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-tech text-[9px] tracking-[0.2em] text-white/30 uppercase">HOME</span>
          <span className="text-white/15 text-[10px]">›</span>
          <span className="font-tech text-[9px] tracking-[0.2em] text-white/50 uppercase">DASHBOARD</span>
        </div>

        {/* Hero */}
        <section className="flex items-start justify-between mb-16">
          <div>
            <h1 className="text-5xl font-display neon-gradient leading-tight mb-2 uppercase">
              MARKET SIGNAL
            </h1>
            <p className="text-[11px] text-white/50 font-mono max-w-md leading-relaxed uppercase tracking-wide">
              COMPOSITE SCORE FROM 6 ONCHAIN &amp; OFFCHAIN CATEGORIES. AI-CURATED ANALYSIS UPDATED 3-5× DAILY.
            </p>
          </div>

          <div className="flex items-center gap-10">
            <ScoreRing score={compositeScore} size={160} strokeWidth={5} change={4} />

            <div className="grid grid-cols-2 gap-2">
              {mockCategories.map((cat) => {
                const color = cat.score >= 70 ? "#adff00" : cat.score >= 50 ? "#00f2ff" : "#ff00e5";
                return (
                  <div key={cat.name} className="glass px-3 py-2 flex items-center gap-2.5 min-w-[160px]">
                    <span className="text-sm">{cat.emoji}</span>
                    <span className="font-tech text-[8px] tracking-[0.15em] text-white/50 flex-1 uppercase">{cat.name}</span>
                    <span className="font-mono text-sm font-bold" style={{ color }}>{cat.score}</span>
                    <span className={`font-tech text-[8px] uppercase ${cat.change >= 0 ? "text-[#adff00]" : "text-[#ff00e5]"}`}>
                      {cat.change >= 0 ? "▲" : "▼"}{Math.abs(cat.change)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brief */}
        <section className="mb-10">
          <BriefCard brief={mockBrief} />
        </section>

        {/* Widgets + Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {mockCategories.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <LiveFeed events={mockLiveEvents} />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16 pt-6 pb-4 flex items-center justify-between">
          <span className="font-tech text-[9px] tracking-[0.2em] text-white/30 uppercase">
            THE SIGNAL — AI MARKET INTELLIGENCE
          </span>
          <span className="font-tech text-[9px] tracking-[0.15em] text-white/20 uppercase">
            NOT FINANCIAL ADVICE · DYOR
          </span>
        </footer>
      </main>
    </div>
  );
}
