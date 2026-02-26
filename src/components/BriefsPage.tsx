"use client";

import { Brief } from "@/lib/analysis";
import Link from "next/link";
import { useState } from "react";

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

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
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

// Mock historical briefs
const historicalBriefs = [
  { date: "Feb 25, 2026", sentiment: "NEUTRAL" },
  { date: "Feb 24, 2026", sentiment: "BULLISH" },
  { date: "Feb 23, 2026", sentiment: "CAUTIOUS" },
  { date: "Feb 22, 2026", sentiment: "BULLISH" },
];

export default function BriefsPage({ brief }: { brief: Brief }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState("");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just UI - no backend
    alert(`Thanks! We'll send daily briefs to ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Toast notification */}
      {showToast && (
        <div className="toast">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[13px] text-white font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}

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

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2">General</p>
          <Link href="/" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">📊</span>Dashboard
          </Link>
          <Link href="/briefs" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] sidebar-active font-semibold">
            <span className="text-[14px]">📋</span>Briefs
          </Link>
          <Link href="#" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">🔍</span>Analysis
          </Link>
          <Link href="#" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] text-[#a0a3b1] hover:bg-[#161921] hover:text-white transition-all">
            <span className="text-[14px]">📡</span>Live Feed
          </Link>

          {/* Historical Briefs Section */}
          <p className="text-[10px] font-semibold text-[#6b6f7e] uppercase tracking-wider px-3 mb-2 mt-6">Previous Briefs</p>
          <div className="space-y-0.5">
            {historicalBriefs.map((item, i) => (
              <button 
                key={i}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[12px] text-[#6b6f7e] hover:bg-[#161921] hover:text-[#a0a3b1] transition-all cursor-not-allowed opacity-60"
                disabled
              >
                <span>{item.date}</span>
                <span className={`w-2 h-2 rounded-full ${
                  item.sentiment === "BULLISH" ? "bg-[#34d399]" :
                  item.sentiment === "BEARISH" ? "bg-[#f87171]" :
                  item.sentiment === "CAUTIOUS" ? "bg-[#fb923c]" :
                  "bg-[#fbbf24]"
                }`} />
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="ml-0 md:ml-[220px] flex-1 w-full">
        <header className="h-16 border-b border-[#23262f] flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[#0f1117]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button 
              className="hamburger text-white md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href="/" className="text-[#6b6f7e] hover:text-white transition-colors text-[13px] hidden sm:block">← Dashboard</Link>
            <h1 className="text-[18px] md:text-[20px] font-bold text-white">Signal Brief</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[11px] text-[#34d399] font-medium hidden sm:inline">Live</span>
            </div>
            <span className="text-[11px] md:text-[12px] text-[#6b6f7e]">{getRelativeTime(brief.timestamp)}</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Hero */}
          <div className="card p-6 md:p-8 mb-6 hover-lift">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${sentimentColors[brief.sentiment]}`}>
                    {brief.sentiment}
                  </span>
                  <span className="text-[12px] text-[#6b6f7e]">Composite Score</span>
                  <span className="text-[11px] text-[#6b6f7e]">· {getRelativeTime(brief.timestamp)}</span>
                </div>
                <h2 className="text-[24px] md:text-[28px] font-bold text-white leading-tight mb-4">{brief.headline}</h2>
                <p className="text-[13px] md:text-[14px] text-[#a0a3b1] leading-relaxed">{brief.tldr}</p>
              </div>
              <div className="flex flex-col items-center md:ml-8">
                <span className="text-5xl md:text-6xl font-bold text-white animate-number">{brief.compositeScore}</span>
                <span className="text-[11px] text-[#6b6f7e] mt-1">/100</span>
              </div>
            </div>
            
            {/* Share button */}
            <div className="pt-4 border-t border-[#23262f] flex items-center justify-between">
              <span className="text-[11px] text-[#6b6f7e]">Share this brief</span>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[#4f6ef7] hover:bg-[#5d7cf8] text-white text-[12px] font-semibold rounded-lg transition-all hover-lift"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 5L11 3C11 2.44772 10.5523 2 10 2L3 2C2.44772 2 2 2.44772 2 3L2 10C2 10.5523 2.44772 11 3 11H5M8 6H13M13 6L11 4M13 6L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="card p-5 md:p-6 mb-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-white">Key Takeaways</h3>
              <span className="text-[11px] text-[#6b6f7e]">Updated {getRelativeTime(brief.timestamp)}</span>
            </div>
            <div className="space-y-2">
              {brief.keyTakeaways.map((t, i) => (
                <div key={i} className="bg-[#161921] rounded-xl px-4 py-3 text-[13px] text-[#a0a3b1] leading-relaxed hover:bg-[#1c1f2a] transition-colors">
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="space-y-4 mb-6">
            {brief.sections.map((section, idx) => {
              const colors = signalColors[section.signal];
              return (
                <div key={section.title} className="card p-5 md:p-6 hover-lift">
                  {/* Section header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.emoji}</span>
                      <h3 className="text-[15px] font-semibold text-white">{section.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6b6f7e]">{getRelativeTime(brief.timestamp)}</span>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {section.signal}
                      </span>
                    </div>
                  </div>

                  {/* Analysis text */}
                  <p className="text-[13px] text-[#a0a3b1] leading-[1.8] mb-5">{section.analysis}</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {section.keyMetrics.map((m, i) => {
                      const mColors = signalColors[m.signal];
                      return (
                        <div key={i} className="bg-[#0a0c10] rounded-xl p-3.5 hover:bg-[#0d0f14] transition-colors">
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
          <div className="card p-5 md:p-6 mb-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                ⚠️ Risk Factors
              </h3>
              <span className="text-[11px] text-[#6b6f7e]">Updated {getRelativeTime(brief.timestamp)}</span>
            </div>
            <div className="space-y-2">
              {brief.riskFactors.map((r, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px] text-[#a0a3b1] leading-relaxed">
                  <span className="text-[#f87171] mt-0.5">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Capture */}
          <div className="card p-6 md:p-8 mb-6 text-center hover-lift">
            <h3 className="text-[18px] md:text-[20px] font-bold text-white mb-2">Get Daily Briefs</h3>
            <p className="text-[13px] text-[#a0a3b1] mb-5">
              Receive AI-powered market intelligence delivered to your inbox every morning.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-[#161921] border border-[#23262f] rounded-lg text-white text-[14px] focus:outline-none focus:border-[#4f6ef7] transition-colors"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[#4f6ef7] hover:bg-[#5d7cf8] text-white text-[14px] font-semibold rounded-lg transition-all hover-lift"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-[#6b6f7e] mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-center py-6 border-t border-[#23262f]">
            <p className="text-[11px] text-[#6b6f7e]">
              THE SIGNAL — AI-powered market intelligence. This is not financial advice. Always do your own research.
            </p>
            <p className="text-[10px] text-[#6b6f7e] mt-1">
              Data sources: CoinGecko, DeFi Llama, Alternative.me · Updated every 5 minutes
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/" className="text-[11px] text-[#6b6f7e] hover:text-white transition-colors">
                Dashboard
              </Link>
              <span className="text-[#6b6f7e]">·</span>
              <Link href="#" className="text-[11px] text-[#6b6f7e] hover:text-white transition-colors">
                Documentation
              </Link>
              <span className="text-[#6b6f7e]">·</span>
              <Link href="#" className="text-[11px] text-[#6b6f7e] hover:text-white transition-colors">
                API
              </Link>
            </div>
            <div className="text-[10px] text-[#6b6f7e] mt-3">
              v1.0.0 · Built with ❤️ by The Signal Team
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
