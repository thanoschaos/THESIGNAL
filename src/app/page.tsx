import ScoreRing from "@/components/ScoreRing";
import CategoryCard from "@/components/CategoryCard";
import LiveFeed from "@/components/LiveFeed";
import BriefCard from "@/components/BriefCard";
import { mockCategories, mockLiveEvents, mockBrief, getCompositeScore } from "@/lib/mock-data";

export default function Home() {
  const compositeScore = getCompositeScore(mockCategories);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center">
              <span className="text-black font-bold text-sm">📡</span>
            </div>
            <h1 className="text-xl font-bold text-[#e8e8ed]">
              THE SIGNAL
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] live-dot" />
              <span className="text-xs text-[#00ff88] font-medium tracking-wider">LIVE</span>
            </div>
            <button className="px-4 py-2 bg-[#00ff88] text-black text-sm font-semibold rounded-lg hover:bg-[#00dd77] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero — Composite Score */}
        <section className="flex flex-col items-center mb-12">
          <p className="text-sm text-[#8888a0] mb-2 tracking-wider uppercase">Overall Market Signal</p>
          <ScoreRing score={compositeScore} size={180} strokeWidth={10} change={4} />
          <p className="mt-4 text-sm text-[#8888a0] max-w-md text-center">
            Composite score from 6 categories, weighted by signal strength. Updated every ~4 hours.
          </p>
          {/* Mini category scores */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {mockCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg px-3 py-2">
                <span>{cat.emoji}</span>
                <span className="text-xs text-[#8888a0]">{cat.name}</span>
                <span className="text-sm font-bold" style={{
                  color: cat.score >= 70 ? "#00ff88" : cat.score >= 50 ? "#ffaa00" : "#ff4466"
                }}>
                  {cat.score}
                </span>
                <span className={`text-xs ${cat.change >= 0 ? "text-[#00ff88]" : "text-[#ff4466]"}`}>
                  {cat.change >= 0 ? "↑" : "↓"}{Math.abs(cat.change)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Brief */}
        <section className="mb-8">
          <BriefCard brief={mockBrief} />
        </section>

        {/* Category Widgets + Live Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category grid — 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockCategories.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </div>

          {/* Live Feed — sidebar */}
          <div className="lg:col-span-1">
            <LiveFeed events={mockLiveEvents} />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2a2a3a] pt-6 pb-8 text-center">
          <p className="text-xs text-[#8888a0]">
            THE SIGNAL — AI-powered market intelligence. Not financial advice. DYOR.
          </p>
        </footer>
      </main>
    </div>
  );
}
