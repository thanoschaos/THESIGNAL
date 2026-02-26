"use client";

import { SignalBrief } from "@/lib/mock-data";

export default function BriefCard({ brief }: { brief: SignalBrief }) {
  return (
    <div className="glass rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] flex items-center justify-center">
            <span className="text-black text-[10px] font-black">S</span>
          </div>
          <h3 className="font-tech text-[11px] tracking-[0.2em] text-white/90">LATEST SIGNAL BRIEF</h3>
        </div>
        <span className="font-tech text-[9px] tracking-[0.15em] text-white/30">{brief.timestamp}</span>
      </div>

      {/* Headline */}
      <h2 className="text-xl font-display neon-gradient mb-3 leading-tight">{brief.headline}</h2>
      <p className="text-[12px] text-white/40 leading-relaxed font-mono mb-5">{brief.summary}</p>

      {/* Highlights */}
      <div className="space-y-2">
        {brief.highlights.map((h, i) => (
          <div key={i} className="glass rounded-md px-4 py-2.5 text-[11px] text-white/70 font-mono leading-relaxed row-hover">
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
